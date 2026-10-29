import { patients } from '../data/mockData'
import type { Patient, SavedClinicalNote } from '../types'

interface HomeScreenProps {
  selectedPatientId: string
  savedNotes: SavedClinicalNote[]
  highlightNoteId?: string | null
  onSelectPatient: (id: string) => void
  onOpenEncounter: () => void
  onOpenSavedNote: (noteId: string) => void
}

export function HomeScreen({
  selectedPatientId,
  savedNotes,
  highlightNoteId = null,
  onSelectPatient,
  onOpenEncounter,
  onOpenSavedNote,
}: HomeScreenProps) {
  const selected = patients.find((p) => p.id === selectedPatientId) as Patient
  const patientNotes = savedNotes
    .filter((note) => note.patientId === selectedPatientId)
    .sort(
      (a, b) =>
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    )

  return (
    <section className="home-page">
      <div className="home-top">
        <div className="welcome-card">
          <img src="/everi-logo.png" alt="Everi Labs" />
          <div>
            <strong>Everi Labs</strong>
            <span>Noor</span>
          </div>
        </div>

        <div className="assist-card">
          <span className="assist-icon" aria-hidden>
            ✦
          </span>
          <input
            type="text"
            placeholder="What do you need help with today?"
            aria-label="Assistant prompt"
            readOnly
            onFocus={onOpenEncounter}
          />
          <button type="button" className="assist-go" onClick={onOpenEncounter}>
            →
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <button type="button" className="chip-btn" disabled>
          + Add new patient
        </button>
        <button type="button" className="chip-btn" disabled>
          Document Intake
        </button>
        <button
          type="button"
          className="chip-btn primary"
          onClick={onOpenEncounter}
        >
          Start Clinical Encounter
        </button>
        <button type="button" className="chip-btn" disabled>
          Forms
        </button>
        <button type="button" className="chip-btn" disabled>
          Claim Preparation
        </button>
      </div>

      <div className="home-grid">
        <div className="panel panel-pad">
          <div className="panel-head">
            <h2>Patient Selection</h2>
            <div className="panel-head-actions">
              <button type="button" className="chip-btn" disabled>
                Import from Nymbl
              </button>
              <button type="button" className="chip-btn" disabled>
                + Add New Patient
              </button>
            </div>
          </div>

          <label className="search-field">
            <span aria-hidden>⌕</span>
            <input
              type="search"
              placeholder="Search patient by name..."
              aria-label="Search patients"
              readOnly
            />
          </label>

          <div className="patient-table" role="list">
            {patients.map((patient) => {
              const count = savedNotes.filter(
                (n) => n.patientId === patient.id,
              ).length
              return (
                <button
                  key={patient.id}
                  type="button"
                  role="listitem"
                  className={`patient-row${selectedPatientId === patient.id ? ' selected' : ''}`}
                  onClick={() => onSelectPatient(patient.id)}
                >
                  <span className="patient-name">{patient.name}</span>
                  <span>Age {patient.age}</span>
                  <span>{patient.sex}</span>
                  <span className="patient-device">
                    {patient.device}
                    {count > 0 ? ` · ${count} saved note${count > 1 ? 's' : ''}` : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="panel panel-pad detail-panel">
          {selected ? (
            <>
              <p className="section-label">Selected patient</p>
              <h2>{selected.name}</h2>
              <dl className="detail-list">
                <div>
                  <dt>Device</dt>
                  <dd>{selected.device}</dd>
                </div>
                <div>
                  <dt>Reason</dt>
                  <dd>{selected.reason}</dd>
                </div>
              </dl>
              <ul className="history-list">
                {selected.history.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="chart-notes">
                <p className="section-label">Clinical notes (patient chart)</p>
                {patientNotes.length === 0 ? (
                  <p className="quiet-note" style={{ margin: 0 }}>
                    No finalized notes yet. Complete an encounter and finalize to
                    save here.
                  </p>
                ) : (
                  <ul className="saved-note-list">
                    {patientNotes.map((note) => (
                      <li key={note.id}>
                        <button
                          type="button"
                          className={`saved-note-item${highlightNoteId === note.id ? ' highlight' : ''}`}
                          onClick={() => onOpenSavedNote(note.id)}
                        >
                          <strong>{note.encounterLabel}</strong>
                          <span>
                            Saved {new Date(note.savedAt).toLocaleString()}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onOpenEncounter}
                >
                  Open Clinical Encounter
                </button>
              </div>
            </>
          ) : (
            <div className="empty-detail">
              <p>Choose patient</p>
              <span>Select a patient from the list to view details.</span>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
