import type { SavedClinicalNote } from '../types'

/** Keep PDF text in WinAnsi-safe ASCII for Helvetica. */
function toPdfSafe(value: string): string {
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function wrapLine(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxChars) {
      current = next
    } else {
      if (current) lines.push(current)
      if (word.length > maxChars) {
        for (let i = 0; i < word.length; i += maxChars) {
          lines.push(word.slice(i, i + maxChars))
        }
        current = ''
      } else {
        current = word
      }
    }
  }

  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

function buildContentStream(lines: string[]): string {
  const left = 50
  const top = 742
  const lineHeight = 14
  const bottom = 56
  const commands: string[] = ['BT', '/F1 11 Tf', `${left} ${top} Td`]
  let y = top
  let truncated = false

  lines.forEach((line, index) => {
    if (truncated) return

    if (y < bottom) {
      truncated = true
      commands.push(
        `0 -${lineHeight} Td`,
        '(...content continued; open in app for full note.) Tj',
      )
      return
    }

    const safe = toPdfSafe(line)
    if (index === 0) {
      commands.push('/F1 16 Tf', `(${safe}) Tj`, '/F1 11 Tf', `0 -${lineHeight + 6} Td`)
      y -= lineHeight + 6
      return
    }

    commands.push(`(${safe}) Tj`, `0 -${lineHeight} Td`)
    y -= lineHeight
  })

  commands.push('ET')
  return commands.join('\n')
}

function encodePdf(parts: string[]): Uint8Array {
  const encoder = new TextEncoder()
  const chunks = parts.map((part) => encoder.encode(part))
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return bytes
}

/** Reliable single-page text PDF export (no external library). */
export function downloadNotePdf(note: SavedClinicalNote): void {
  const date = new Date(note.savedAt).toLocaleString()
  const lines: string[] = [
    'Everi Labs - Clinical Encounter Note',
    'Status: Clinician reviewed / finalized',
    '',
    `Patient: ${note.patientName}`,
    `Encounter: ${note.encounterLabel}`,
    `Saved: ${date}`,
    note.wasInterrupted
      ? 'Flag: Built from an interrupted recording'
      : 'Flag: Completed capture',
    '',
  ]

  for (const section of note.sections) {
    lines.push(section.title.toUpperCase())
    lines.push(
      ...wrapLine(section.content.replace(/\s+/g, ' ').trim(), 88),
    )
    lines.push('')
  }

  lines.push('Prototype export. Not a certified medical record system.')

  const stream = buildContentStream(lines)
  const streamBytes = new TextEncoder().encode(stream)

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'
  const obj3 =
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n'
  const obj4 =
    `4 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj\n`
  const obj5 =
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'

  const header = '%PDF-1.4\n'
  const bodyParts = [obj1, obj2, obj3, obj4, obj5]
  const offsets: number[] = [0]
  let cursor = header.length

  for (const part of bodyParts) {
    offsets.push(cursor)
    cursor += new TextEncoder().encode(part).length
  }

  let xref = `xref\n0 ${bodyParts.length + 1}\n`
  xref += '0000000000 65535 f \n'
  for (let i = 1; i < offsets.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }

  const trailer =
    `trailer\n<< /Size ${bodyParts.length + 1} /Root 1 0 R >>\n` +
    `startxref\n${cursor}\n%%EOF`

  const pdfBytes = encodePdf([header, ...bodyParts, xref, trailer])
  const blob = new Blob([Uint8Array.from(pdfBytes)], {
    type: 'application/pdf',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeName = note.patientName.toLowerCase().replace(/\s+/g, '-')
  anchor.href = url
  anchor.download = `everi-note-${safeName}-${note.id.slice(0, 8)}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
