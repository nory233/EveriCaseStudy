import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type {
  ChecklistTopic,
  Patient,
  RecordingStatus,
  TranscriptLine,
} from '../types'
import { formatTimer } from '../utils'

interface EncounterScreenProps {
  patient: Patient
  encounterLabel: string
  status: RecordingStatus
  elapsedSeconds: number
  checklist: ChecklistTopic[]
  visibleTranscript: TranscriptLine[]
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onInterrupt: () => void
  onContinueAfterInterrupt: () => void
  onDiscardEncounter: () => void
}

function statusLabel(status: RecordingStatus): string {
  switch (status) {
    case 'ready':
      return 'Ready'
    case 'recording':
      return 'Recording'
    case 'paused':
      return 'Paused'
    case 'interrupted':
      return 'Interrupted'
    case 'stopped':
      return 'Stopped'
  }
}

export function EncounterScreen({
  patient,
  encounterLabel,
  status,
  elapsedSeconds,
  checklist,
  visibleTranscript,
  onStart,
  onPause,
  onResume,
  onStop,
  onInterrupt,
  onContinueAfterInterrupt,
  onDiscardEncounter,
}: EncounterScreenProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const isLive = status === 'recording'
  const uncovered = checklist.filter(
    (t) => t.status === 'not-covered' || t.status === 'needs-review',
  )

  return (
    <section>
      <h1 className="hero-title">During the encounter</h1>
      <p className="lede">
        Stay with the patient. Recording and organization stay quiet in the
        background. Expand details only if you need them.
      </p>

      <div className="encounter-top" style={{ marginTop: '1.5rem' }}>
        <div className="panel record-stage">
          <div className={`record-status ${status}`}>
            <span className="status-dot" aria-hidden />
            {statusLabel(status)}
          </div>

          <div className="timer" aria-live="polite">
            {formatTimer(elapsedSeconds)}
          </div>
          <p className="quiet-note">
            {patient.name} · {encounterLabel}
          </p>

          {status === 'interrupted' ? (
            <div className="interrupt-banner">
              <strong>Recording interrupted</strong>
              <p>
                Capture stopped unexpectedly. Progress up to{' '}
                {formatTimer(elapsedSeconds)} was saved. Closing topics (like
                plan/follow-up) may be missing. Nothing after the interruption
                was captured.
              </p>
              {uncovered.length > 0 && (
                <ul className="interrupt-gaps">
                  {uncovered.slice(0, 4).map((topic) => (
                    <li key={topic.id}>{topic.label}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className={`capture-pill${isLive ? ' active' : ''}`}>
              <span className="bar" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              {isLive
                ? 'Capturing & organizing relevant information'
                : status === 'paused'
                  ? 'Capture paused'
                  : 'Simulated capture idle'}
            </div>
          )}

          <div className="controls">
            {status === 'ready' && (
              <button type="button" className="btn btn-primary" onClick={onStart}>
                Start recording
              </button>
            )}
            {status === 'recording' && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onPause}
                >
                  Pause
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setConfirmStop(true)}
                >
                  Stop & review note
                </button>
              </>
            )}
            {status === 'paused' && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onResume}
                >
                  Resume
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setConfirmStop(true)}
                >
                  Stop & review note
                </button>
              </>
            )}
            {status === 'interrupted' && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onResume}
                >
                  Resume recording
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onContinueAfterInterrupt}
                >
                  Draft note from what we have
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setConfirmDiscard(true)}
                >
                  Discard encounter
                </button>
              </>
            )}
            {status === 'stopped' && (
              <button type="button" className="btn btn-primary" onClick={onStop}>
                Continue to review
              </button>
            )}
          </div>

          {(status === 'recording' || status === 'paused') && (
            <button
              type="button"
              className="simulate-interrupt"
              onClick={onInterrupt}
            >
              Simulate sudden interruption
            </button>
          )}
        </div>

        <div className="panel topics-panel">
          <div className="topics-panel-head">
            <h2>Documentation topics</h2>
            <span className="topics-hint">Updates quietly while you record</span>
          </div>
          <ul className="checklist">
            {checklist.map((topic) => (
              <li key={topic.id}>
                <span>{topic.label}</span>
                <span className={`badge ${topic.status}`}>
                  {topic.status === 'captured'
                    ? 'Captured'
                    : topic.status === 'needs-review'
                      ? 'Needs review'
                      : 'Not yet covered'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`panel collapsible transcript-under${showTranscript ? ' open' : ''}`}
      >
        <header>
          <h2>Live transcript</h2>
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            aria-expanded={showTranscript}
          >
            {showTranscript ? 'Collapse' : 'Expand'}
          </button>
        </header>
        {showTranscript && (
          <div className="body">
            {visibleTranscript.length === 0 ? (
              <p className="quiet-note" style={{ margin: 0 }}>
                Sample conversation appears as the simulated recording
                progresses.
              </p>
            ) : (
              <div className="transcript">
                {visibleTranscript.map((line) => (
                  <div key={line.id} className="line">
                    <div className="speaker">{line.speaker}</div>
                    <p>{line.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmStop}
        title="Stop recording?"
        message="This ends the live capture and opens the draft note for review. You can still edit everything afterward."
        confirmLabel="Stop & review"
        danger
        onCancel={() => setConfirmStop(false)}
        onConfirm={() => {
          setConfirmStop(false)
          onStop()
        }}
      />

      <ConfirmDialog
        open={confirmDiscard}
        title="Discard this encounter?"
        message="Saved recording progress and any captured topics for this visit will be cleared. This cannot be undone."
        confirmLabel="Yes, discard"
        danger
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          setConfirmDiscard(false)
          onDiscardEncounter()
        }}
      />
    </section>
  )
}
