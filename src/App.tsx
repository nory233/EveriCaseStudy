import { useEffect, useMemo, useState } from 'react'
import { AppSidebar, type NavPage } from './components/AppSidebar'
import { ConfirmDialog } from './components/ConfirmDialog'
import { WorkflowStepper } from './components/WorkflowStepper'
import {
  cloneScenario,
  encounterTypes,
  patients,
} from './data/mockData'
import { EncounterScreen } from './screens/EncounterScreen'
import { HomeScreen } from './screens/HomeScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { SavedNoteScreen } from './screens/SavedNoteScreen'
import { SetupScreen } from './screens/SetupScreen'
import type {
  ChecklistTopic,
  EncounterScenario,
  EncounterTypeId,
  RecordingStatus,
  SavedClinicalNote,
  Screen,
  WarningStatus,
} from './types'

function applyProgress(
  scenario: EncounterScenario,
  elapsedSeconds: number,
): EncounterScenario {
  const checklist: ChecklistTopic[] = scenario.checklist.map((topic) => {
    if (topic.appearAtSeconds == null || elapsedSeconds < topic.appearAtSeconds) {
      return topic
    }
    if (topic.id === 'pain' || topic.id === 'mobility') {
      return { ...topic, status: 'needs-review' }
    }
    return { ...topic, status: 'captured' }
  })

  return { ...scenario, checklist }
}

export default function App() {
  const [navPage, setNavPage] = useState<NavPage>('home')
  const [screen, setScreen] = useState<Screen>('setup')
  const [patientId, setPatientId] = useState(patients[0].id)
  const [encounterTypeId, setEncounterTypeId] =
    useState<EncounterTypeId>('prosthetic-fitting')
  const [status, setStatus] = useState<RecordingStatus>('ready')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [scenario, setScenario] = useState<EncounterScenario>(() =>
    cloneScenario('prosthetic-fitting'),
  )
  const [finalized, setFinalized] = useState(false)
  const [wasInterrupted, setWasInterrupted] = useState(false)
  const [pendingNav, setPendingNav] = useState<NavPage | null>(null)
  const [savedNotes, setSavedNotes] = useState<SavedClinicalNote[]>([])
  const [activeSavedNoteId, setActiveSavedNoteId] = useState<string | null>(null)
  const [highlightNoteId, setHighlightNoteId] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const patient = patients.find((p) => p.id === patientId)!
  const encounterLabel =
    encounterTypes.find((e) => e.id === encounterTypeId)?.label ?? ''
  const latestSavedNote =
    savedNotes.find(
      (note) =>
        note.patientId === patientId &&
        note.encounterTypeId === encounterTypeId &&
        finalized,
    ) ?? null
  const activeSavedNote =
    savedNotes.find((note) => note.id === activeSavedNoteId) ?? null

  const liveScenario = useMemo(
    () => applyProgress(scenario, elapsedSeconds),
    [scenario, elapsedSeconds],
  )

  const visibleTranscript = useMemo(
    () =>
      liveScenario.transcript.filter(
        (line) => line.appearAtSeconds <= elapsedSeconds,
      ),
    [liveScenario.transcript, elapsedSeconds],
  )

  const encounterInProgress =
    navPage === 'clinical-encounter' &&
    ((screen === 'encounter' &&
      (status === 'recording' ||
        status === 'paused' ||
        status === 'interrupted')) ||
      (screen === 'review' && !finalized))

  useEffect(() => {
    if (status !== 'recording') return
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [status])

  function resetEncounterState() {
    setScreen('setup')
    setStatus('ready')
    setElapsedSeconds(0)
    setFinalized(false)
    setWasInterrupted(false)
    setScenario(cloneScenario(encounterTypeId))
    setActiveSavedNoteId(null)
  }

  function openClinicalEncounter() {
    setNavPage('clinical-encounter')
    setActiveSavedNoteId(null)
    resetEncounterState()
  }

  function handleNavigate(page: NavPage) {
    if (page === navPage && activeSavedNoteId === null) return

    if (encounterInProgress && page !== 'clinical-encounter') {
      setPendingNav(page)
      return
    }

    setActiveSavedNoteId(null)

    if (page === 'clinical-encounter') {
      openClinicalEncounter()
      return
    }

    setNavPage(page)
  }

  function startEncounter() {
    setScenario(cloneScenario(encounterTypeId))
    setElapsedSeconds(0)
    setStatus('ready')
    setFinalized(false)
    setWasInterrupted(false)
    setScreen('encounter')
    setNavPage('clinical-encounter')
    setActiveSavedNoteId(null)
  }

  function prepareReviewFromCapture() {
    setScenario((prev) => {
      const progressed = applyProgress(prev, elapsedSeconds)
      return {
        ...progressed,
        checklist: progressed.checklist.map((topic) =>
          topic.status === 'not-covered'
            ? { ...topic, status: 'needs-review' }
            : topic,
        ),
      }
    })
    setScreen('review')
  }

  function handleStop() {
    setStatus('stopped')
    prepareReviewFromCapture()
  }

  function handleInterrupt() {
    setStatus('interrupted')
    setWasInterrupted(true)
  }

  function handleContinueAfterInterrupt() {
    setStatus('stopped')
    prepareReviewFromCapture()
  }

  function updateNote(sectionId: string, content: string) {
    setScenario((prev) => ({
      ...prev,
      noteSections: prev.noteSections.map((section) =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    }))
  }

  function updateWarning(warningId: string, next: WarningStatus) {
    setScenario((prev) => ({
      ...prev,
      warnings: prev.warnings.map((warning) =>
        warning.id === warningId ? { ...warning, status: next } : warning,
      ),
    }))
  }

  function handleFinalize() {
    const saved: SavedClinicalNote = {
      id: `note-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      encounterTypeId,
      encounterLabel,
      savedAt: new Date().toISOString(),
      wasInterrupted,
      sections: scenario.noteSections.map((section) => ({ ...section })),
    }
    setSavedNotes((prev) => [saved, ...prev])
    setFinalized(true)
    setHighlightNoteId(saved.id)
  }

  function openPatientChart(noteId?: string) {
    setNavPage('patients')
    setActiveSavedNoteId(null)
    if (noteId) setHighlightNoteId(noteId)
  }

  function openSavedNote(noteId: string) {
    const note = savedNotes.find((item) => item.id === noteId)
    if (!note) return
    setPatientId(note.patientId)
    setActiveSavedNoteId(noteId)
    setHighlightNoteId(noteId)
    setNavPage('patients')
  }

  function startOver() {
    resetEncounterState()
    setNavPage('clinical-encounter')
  }

  const pageTitle =
    navPage === 'home'
      ? 'Home'
      : navPage === 'patients'
        ? activeSavedNote
          ? 'Clinical note'
          : 'Patients'
        : 'Clinical Encounter'

  return (
    <div className={`app-shell${mobileNavOpen ? ' nav-open' : ''}`}>
      <AppSidebar
        activePage={navPage === 'patients' && activeSavedNote ? 'patients' : navPage}
        open={mobileNavOpen}
        onNavigate={handleNavigate}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="workspace">
        <div className="mobile-topbar">
          <button
            type="button"
            className="burger-btn"
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            aria-controls="app-sidebar"
            onClick={() => setMobileNavOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="mobile-topbar-brand">
            <img src="/everi-logo.png" alt="" />
            <strong>{pageTitle}</strong>
          </div>
        </div>

        {navPage === 'clinical-encounter' && (
          <div className="workspace-toolbar">
            <div>
              <h1 className="page-title">{pageTitle}</h1>
              <p className="workspace-sub">
                Capture the visit quietly, then review and finalize the note.
              </p>
            </div>
            <WorkflowStepper screen={screen} finalized={finalized} />
          </div>
        )}

        {(navPage === 'home' || (navPage === 'patients' && !activeSavedNote)) && (
          <div className="workspace-toolbar">
            <div>
              <h1 className="page-title">{pageTitle}</h1>
              <p className="workspace-sub">
                Finalized notes are stored on the patient chart for easy access.
              </p>
            </div>
          </div>
        )}

        {navPage === 'patients' && activeSavedNote && (
          <div className="workspace-toolbar">
            <div>
              <h1 className="page-title">{pageTitle}</h1>
              <p className="workspace-sub">
                Patients → {activeSavedNote.patientName} → Clinical notes
              </p>
            </div>
          </div>
        )}

        <main className="main-panel">
          {(navPage === 'home' ||
            (navPage === 'patients' && !activeSavedNote)) && (
            <HomeScreen
              selectedPatientId={patientId}
              savedNotes={savedNotes}
              highlightNoteId={highlightNoteId}
              onSelectPatient={setPatientId}
              onOpenEncounter={openClinicalEncounter}
              onOpenSavedNote={openSavedNote}
            />
          )}

          {navPage === 'patients' && activeSavedNote && (
            <SavedNoteScreen
              note={activeSavedNote}
              onBack={() => setActiveSavedNoteId(null)}
              onStartEncounter={openClinicalEncounter}
            />
          )}

          {navPage === 'clinical-encounter' && screen === 'setup' && (
            <SetupScreen
              patientId={patientId}
              encounterTypeId={encounterTypeId}
              onPatientChange={setPatientId}
              onEncounterTypeChange={setEncounterTypeId}
              onStart={startEncounter}
            />
          )}

          {navPage === 'clinical-encounter' && screen === 'encounter' && (
            <EncounterScreen
              patient={patient}
              encounterLabel={encounterLabel}
              status={status}
              elapsedSeconds={elapsedSeconds}
              checklist={liveScenario.checklist}
              visibleTranscript={visibleTranscript}
              onStart={() => setStatus('recording')}
              onPause={() => setStatus('paused')}
              onResume={() => setStatus('recording')}
              onStop={handleStop}
              onInterrupt={handleInterrupt}
              onContinueAfterInterrupt={handleContinueAfterInterrupt}
              onDiscardEncounter={startOver}
            />
          )}

          {navPage === 'clinical-encounter' && screen === 'review' && (
            <ReviewScreen
              patient={patient}
              encounterLabel={encounterLabel}
              noteSections={scenario.noteSections}
              warnings={scenario.warnings}
              transcript={scenario.transcript}
              finalized={finalized}
              wasInterrupted={wasInterrupted}
              savedNote={latestSavedNote}
              onNoteChange={updateNote}
              onWarningStatus={updateWarning}
              onFinalize={handleFinalize}
              onStartOver={startOver}
              onOpenPatientChart={() =>
                openPatientChart(latestSavedNote?.id)
              }
            />
          )}
        </main>
      </div>

      <ConfirmDialog
        open={pendingNav !== null}
        title="Leave this encounter?"
        message="A recording is in progress or was interrupted. Leaving now keeps you from continuing this capture. Progress so far can be treated as interrupted if you stay, but navigating away will reset this encounter in the prototype."
        confirmLabel="Yes, leave"
        cancelLabel="Stay here"
        danger
        onCancel={() => setPendingNav(null)}
        onConfirm={() => {
          const next = pendingNav
          setPendingNav(null)
          if (!next) return
          resetEncounterState()
          if (next === 'clinical-encounter') {
            setNavPage('clinical-encounter')
            return
          }
          setNavPage(next)
        }}
      />
    </div>
  )
}
