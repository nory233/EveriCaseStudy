import type { SavedClinicalNote } from '../types'
import { downloadNotePdf } from '../utils/downloadNotePdf'

interface SavedNoteScreenProps {
  note: SavedClinicalNote
  onBack: () => void
  onStartEncounter: () => void
}

export function SavedNoteScreen({
  note,
  onBack,
  onStartEncounter,
}: SavedNoteScreenProps) {
  const savedLabel = new Date(note.savedAt).toLocaleString()

  return (
    <section>
      <div className="saved-note-toolbar">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back to patient chart
        </button>
        <div className="actions" style={{ marginTop: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => downloadNotePdf(note)}
          >
            Download PDF
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStartEncounter}
          >
            New encounter
          </button>
        </div>
      </div>

      <div className="draft-banner final" style={{ marginTop: '0.75rem' }}>
        <span>Saved in patient chart · clinician reviewed</span>
        <span>{note.patientName}</span>
      </div>

      <div className="saved-note-meta">
        <div>
          <span className="section-label">Encounter</span>
          <p>{note.encounterLabel}</p>
        </div>
        <div>
          <span className="section-label">Saved</span>
          <p>{savedLabel}</p>
        </div>
        <div>
          <span className="section-label">Location</span>
          <p>Patients → {note.patientName} → Clinical notes</p>
        </div>
      </div>

      {note.wasInterrupted && (
        <div className="interrupt-banner review-interrupt">
          <strong>Originally from an interrupted recording</strong>
          <p>
            This note may miss later visit details. It was still clinician-reviewed
            before saving.
          </p>
        </div>
      )}

      <div className="saved-note-body">
        {note.sections.map((section) => (
          <article key={section.id} className="note-section finalized">
            <header>
              <h3>{section.title}</h3>
            </header>
            <p className="readonly">{section.content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
