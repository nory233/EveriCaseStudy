import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type {
  NoteSection,
  Patient,
  SavedClinicalNote,
  TranscriptLine,
  UncertaintyWarning,
  WarningStatus,
} from '../types'
import { downloadNotePdf } from '../utils/downloadNotePdf'

interface ReviewScreenProps {
  patient: Patient
  encounterLabel: string
  noteSections: NoteSection[]
  warnings: UncertaintyWarning[]
  transcript: TranscriptLine[]
  finalized: boolean
  wasInterrupted: boolean
  savedNote: SavedClinicalNote | null
  onNoteChange: (sectionId: string, content: string) => void
  onWarningStatus: (warningId: string, status: WarningStatus) => void
  onFinalize: () => void
  onStartOver: () => void
  onOpenPatientChart: () => void
}

export function ReviewScreen({
  patient,
  encounterLabel,
  noteSections,
  warnings,
  transcript,
  finalized,
  wasInterrupted,
  savedNote,
  onNoteChange,
  onWarningStatus,
  onFinalize,
  onStartOver,
  onOpenPatientChart,
}: ReviewScreenProps) {
  const [activeSourceIds, setActiveSourceIds] = useState<string[]>([])
  const [showTranscript, setShowTranscript] = useState(true)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [confirmFinalize, setConfirmFinalize] = useState(false)
  const [confirmNew, setConfirmNew] = useState(false)
  const transcriptPanelRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const openWarnings = warnings.filter((w) => w.status === 'open')

  function revealSources(ids: string[] = []) {
    const nextIds = ids.filter(Boolean)
    setActiveSourceIds(nextIds)
    setShowTranscript(true)
  }

  useEffect(() => {
    if (activeSourceIds.length === 0) return

    transcriptPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })

    const firstId = activeSourceIds[0]
    window.setTimeout(() => {
      lineRefs.current[firstId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 80)
  }, [activeSourceIds])

  return (
    <section>
      <h1 className="hero-title">Post-visit note review</h1>
      <p className="lede">
        Review the draft, edit anything inaccurate, resolve or acknowledge
        uncertainties, and finalize only when you are satisfied. Nothing here is
        an approved clinical record until you finalize.
      </p>

      <div
        className={`draft-banner${finalized ? ' final' : ''}`}
        style={{ marginTop: '1.25rem' }}
      >
        <span>
          {finalized
            ? 'Note saved to patient chart · clinician reviewed'
            : 'AI-style draft · simulated generation · clinician review required'}
        </span>
        <span>
          {patient.name} · {encounterLabel}
        </span>
      </div>

      {finalized && savedNote && (
        <div className="save-success-card">
          <div>
            <strong>Saved where doctors can find it</strong>
            <p>Patients → {patient.name} → Clinical notes</p>
          </div>
          <div className="save-success-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => downloadNotePdf(savedNote)}
            >
              Download PDF
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenPatientChart}
            >
              Open patient chart
            </button>
          </div>
        </div>
      )}

      {wasInterrupted && !finalized && (
        <div className="interrupt-banner review-interrupt">
          <strong>Built from an interrupted recording</strong>
          <p>
            Capture ended unexpectedly. Later parts of the visit (often plan and
            follow-up) may be incomplete. Do not assume missing details; edit or
            leave them undocumented.
          </p>
        </div>
      )}

      <div className="needs-review-priority panel panel-pad">
        <div className="needs-review-head">
          <div>
            <p className="section-label">Needs review first</p>
            <h2>Uncertainties & missing details</h2>
            <p className="quiet-note" style={{ margin: '0.35rem 0 0' }}>
              {openWarnings.length > 0
                ? `${openWarnings.length} item${openWarnings.length > 1 ? 's' : ''} still need your attention before finalizing.`
                : 'No open uncertainties. You can still edit the note below.'}
            </p>
          </div>
          {openWarnings.length > 0 && (
            <span className="badge needs-review">
              {openWarnings.length} open
            </span>
          )}
        </div>

        {warnings.length === 0 ? (
          <p className="quiet-note" style={{ margin: 0 }}>
            No uncertainties were flagged for this encounter.
          </p>
        ) : (
          <div className="needs-review-grid">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className={`warning-card ${warning.status}`}
              >
                <h3>{warning.title}</h3>
                <p>{warning.detail}</p>
                <div className="warning-actions">
                  <button
                    type="button"
                    className="small-btn primary"
                      onClick={() =>
                        revealSources(warning.relatedTranscriptIds)
                      }
                  >
                    Review transcript
                  </button>
                  {!finalized && warning.status === 'open' && (
                    <>
                      <button
                        type="button"
                        className="small-btn"
                        onClick={() =>
                          onWarningStatus(warning.id, 'resolved')
                        }
                      >
                        Mark resolved
                      </button>
                      <button
                        type="button"
                        className="small-btn"
                        onClick={() =>
                          onWarningStatus(warning.id, 'acknowledged')
                        }
                      >
                        Leave undocumented
                      </button>
                    </>
                  )}
                  {warning.status !== 'open' && (
                    <span className="badge needs-review">
                      {warning.status === 'resolved'
                        ? 'Resolved'
                        : 'Acknowledged'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="review-layout">
        <div>
          <div className="note-editor-head">
            <h2>Clinical note</h2>
            {!finalized ? (
              <span className="edit-pill">Editable draft</span>
            ) : (
              <span className="edit-pill locked">Locked after finalize</span>
            )}
          </div>

          {noteSections.map((section) => (
            <article
              key={section.id}
              className={`note-section${section.isAmbiguous && !finalized ? ' ambiguous' : ''}${finalized ? ' finalized' : ' editable'}`}
            >
              <header>
                <h3>{section.title}</h3>
                <div className="note-section-tools">
                  {!finalized && (
                    <span className="edit-label">Click to edit</span>
                  )}
                  {section.sourceTranscriptIds &&
                    section.sourceTranscriptIds.length > 0 && (
                      <button
                        type="button"
                        className="source-btn"
                        onClick={() =>
                        revealSources(section.sourceTranscriptIds)
                        }
                      >
                        View source
                      </button>
                    )}
                </div>
              </header>
              {finalized ? (
                <p className="readonly">{section.content}</p>
              ) : (
                <textarea
                  value={section.content}
                  onChange={(e) => onNoteChange(section.id, e.target.value)}
                  aria-label={`Edit ${section.title}`}
                  placeholder={`Add or correct details for ${section.title}...`}
                />
              )}
            </article>
          ))}

          <div className="actions">
            {!finalized ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setConfirmFinalize(true)}
              >
                Finalize note
              </button>
            ) : (
              <>
                {savedNote && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => downloadNotePdf(savedNote)}
                  >
                    Download PDF
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onOpenPatientChart}
                >
                  Open patient chart
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setConfirmNew(true)}
                >
                  Start new encounter
                </button>
              </>
            )}
            {!finalized && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setConfirmDiscard(true)}
              >
                Discard & start over
              </button>
            )}
          </div>
          <p className="footer-note">
            Draft statements are tied to this encounter’s transcript. Known chart
            history orients the visit, but missing details are flagged rather than
            filled in from memory or prior notes. Checklist and note structure are
            illustrative and not validated insurance requirements.
          </p>
        </div>

        <aside className="side-stack">
          <div className="meta-card">
            <p className="section-label">Patient chart context</p>
            <dl>
              <div>
                <dt>Patient</dt>
                <dd>{patient.name}</dd>
              </div>
              <div>
                <dt>Device</dt>
                <dd>{patient.device}</dd>
              </div>
              <div>
                <dt>Known history</dt>
                <dd>
                  <ul className="history-list">
                    {patient.history.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <p className="footer-note" style={{ marginTop: '0.85rem' }}>
              History helps set context. It does not invent undocumented facts in
              the draft note.
            </p>
          </div>

          <div
            className={`panel collapsible${showTranscript ? ' open' : ''}`}
            ref={transcriptPanelRef}
          >
            <header>
              <h2>Transcript</h2>
              <div className="transcript-header-actions">
                {activeSourceIds.length > 0 && (
                  <button
                    type="button"
                    className="small-btn"
                    onClick={() => setActiveSourceIds([])}
                  >
                    Clear highlight
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowTranscript((v) => !v)}
                  aria-expanded={showTranscript}
                >
                  {showTranscript ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </header>
            {showTranscript && (
              <div className="body">
                <div className="transcript">
                  {transcript.map((line) => {
                    const highlighted = activeSourceIds.includes(line.id)
                    return (
                      <div
                        key={line.id}
                        ref={(el) => {
                          lineRefs.current[line.id] = el
                        }}
                        className={`line${highlighted ? ' highlight' : ''}`}
                      >
                        <div className="speaker">{line.speaker}</div>
                        <p>{line.text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title="Discard this draft?"
        message="Your edits and this encounter draft will be cleared, and you will return to setup. This cannot be undone."
        confirmLabel="Yes, discard"
        danger
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          setConfirmDiscard(false)
          onStartOver()
        }}
      />

      <ConfirmDialog
        open={confirmFinalize}
        title="Finalize this note?"
        message="Finalizing marks the note as clinician-reviewed. You should only do this after checking uncertainties and edits."
        confirmLabel="Yes, finalize"
        onCancel={() => setConfirmFinalize(false)}
        onConfirm={() => {
          setConfirmFinalize(false)
          onFinalize()
        }}
      />

      <ConfirmDialog
        open={confirmNew}
        title="Start a new encounter?"
        message="You will leave this finalized note view and return to setup for a new visit."
        confirmLabel="Start new"
        onCancel={() => setConfirmNew(false)}
        onConfirm={() => {
          setConfirmNew(false)
          onStartOver()
        }}
      />
    </section>
  )
}
