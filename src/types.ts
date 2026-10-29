export type EncounterTypeId =
  | 'initial-evaluation'
  | 'prosthetic-fitting'
  | 'follow-up'

export type RecordingStatus =
  | 'ready'
  | 'recording'
  | 'paused'
  | 'interrupted'
  | 'stopped'

export type ChecklistStatus = 'captured' | 'not-covered' | 'needs-review'

export type WarningStatus = 'open' | 'resolved' | 'acknowledged'

export type Screen = 'setup' | 'encounter' | 'review'

export interface Patient {
  id: string
  name: string
  age: number
  sex: string
  device: string
  reason: string
  /** Known chart context for clinician orientation; not used to invent missing note facts */
  history: string[]
}

export interface EncounterType {
  id: EncounterTypeId
  label: string
  description: string
}

export interface ChecklistTopic {
  id: string
  label: string
  status: ChecklistStatus
  appearAtSeconds?: number
}

export interface TranscriptLine {
  id: string
  speaker: 'Clinician' | 'Patient'
  text: string
  appearAtSeconds: number
}

export interface NoteSection {
  id: string
  title: string
  content: string
  sourceTranscriptIds?: string[]
  isAmbiguous?: boolean
}

export interface UncertaintyWarning {
  id: string
  title: string
  detail: string
  relatedSectionId: string
  relatedTranscriptIds: string[]
  status: WarningStatus
}

export interface EncounterScenario {
  checklist: ChecklistTopic[]
  transcript: TranscriptLine[]
  noteSections: NoteSection[]
  warnings: UncertaintyWarning[]
}

export interface SavedClinicalNote {
  id: string
  patientId: string
  patientName: string
  encounterTypeId: EncounterTypeId
  encounterLabel: string
  savedAt: string
  wasInterrupted: boolean
  sections: NoteSection[]
}
