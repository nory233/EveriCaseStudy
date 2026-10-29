import { encounterTypes, patients } from '../data/mockData'
import type { EncounterTypeId, Patient } from '../types'

interface SetupScreenProps {
  patientId: string
  encounterTypeId: EncounterTypeId
  onPatientChange: (id: string) => void
  onEncounterTypeChange: (id: EncounterTypeId) => void
  onStart: () => void
}

export function SetupScreen({
  patientId,
  encounterTypeId,
  onPatientChange,
  onEncounterTypeChange,
  onStart,
}: SetupScreenProps) {
  const patient = patients.find((p) => p.id === patientId) as Patient
  const encounterType = encounterTypes.find((e) => e.id === encounterTypeId)!

  return (
    <section>
      <h1 className="hero-title">Set up the encounter</h1>
      <p className="lede">
        Choose the patient and visit type. The checklist and draft note structure
        adapt to the selected encounter, then start recording when you are ready
        to focus on the patient.
      </p>

      <div className="grid-2" style={{ marginTop: '1.75rem' }}>
        <div className="panel panel-pad">
          <p className="section-label">Patient</p>
          <div className="choice-grid" role="radiogroup" aria-label="Patient">
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={patientId === p.id}
                className={`choice${patientId === p.id ? ' selected' : ''}`}
                onClick={() => onPatientChange(p.id)}
              >
                <h3>{p.name}</h3>
                <p>
                  {p.age} · {p.sex} · {p.device}
                </p>
              </button>
            ))}
          </div>

          <p className="section-label" style={{ marginTop: '1.5rem' }}>
            Encounter type
          </p>
          <div
            className="choice-grid"
            role="radiogroup"
            aria-label="Encounter type"
          >
            {encounterTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={encounterTypeId === type.id}
                className={`choice${encounterTypeId === type.id ? ' selected' : ''}`}
                onClick={() => onEncounterTypeChange(type.id)}
              >
                <h3>{type.label}</h3>
                <p>{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="meta-card">
          <p className="section-label">Selected context</p>
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
              <dt>Reason</dt>
              <dd>{patient.reason}</dd>
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
            <div>
              <dt>Encounter</dt>
              <dd>{encounterType.label}</dd>
            </div>
          </dl>

          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={onStart}>
              Start encounter
            </button>
          </div>
          <p className="footer-note">
            Fictional patient data for demonstration. No real PHI is used or
            transmitted.
          </p>
        </aside>
      </div>
    </section>
  )
}
