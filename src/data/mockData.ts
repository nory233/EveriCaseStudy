import type {
  EncounterScenario,
  EncounterType,
  EncounterTypeId,
  Patient,
} from '../types'

export const patients: Patient[] = [
  {
    id: 'alex-morgan',
    name: 'Alex Morgan',
    age: 42,
    sex: 'Male',
    device: 'Left transtibial prosthesis',
    reason: 'Socket discomfort and gait instability after recent activity increase',
    history: [
      'Left transtibial amputation (2019), traumatic',
      'Current definitive prosthesis fitted 8 months ago',
      'Prior visit: minor socket relief; no open wounds documented',
      'Active lifestyle; reports increased daily steps recently',
    ],
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    age: 29,
    sex: 'Female',
    device: 'Right AFO (ankle-foot orthosis)',
    reason: 'Follow-up for orthosis fit and walking tolerance',
    history: [
      'Right drop-foot secondary to peroneal neuropathy',
      'Custom AFO delivered 6 weeks ago',
      'Prior visit: break-in schedule reviewed; mild skin warmth noted',
      'Works standing shifts; goal is full-day wear',
    ],
  },
]

export const encounterTypes: EncounterType[] = [
  {
    id: 'initial-evaluation',
    label: 'Initial evaluation',
    description: 'Baseline assessment, history, and care planning',
  },
  {
    id: 'prosthetic-fitting',
    label: 'Prosthetic fitting and adjustment',
    description: 'Device fit, comfort, mobility, and in-visit adjustments',
  },
  {
    id: 'follow-up',
    label: 'Follow-up',
    description: 'Progress check, residual issues, and next steps',
  },
]

const prostheticFittingScenario: EncounterScenario = {
  checklist: [
    {
      id: 'fit-comfort',
      label: 'Current device fit and comfort',
      status: 'not-covered',
      appearAtSeconds: 8,
    },
    {
      id: 'pain',
      label: 'Pain or discomfort',
      status: 'not-covered',
      appearAtSeconds: 18,
    },
    {
      id: 'skin',
      label: 'Skin condition',
      status: 'not-covered',
      appearAtSeconds: 32,
    },
    {
      id: 'mobility',
      label: 'Walking, mobility, and functional observations',
      status: 'not-covered',
      appearAtSeconds: 45,
    },
    {
      id: 'adjustments',
      label: 'Adjustments made during the visit',
      status: 'not-covered',
      appearAtSeconds: 58,
    },
    {
      id: 'feedback',
      label: 'Patient feedback',
      status: 'not-covered',
      appearAtSeconds: 70,
    },
    {
      id: 'plan',
      label: 'Plan and follow-up',
      status: 'not-covered',
      appearAtSeconds: 82,
    },
  ],
  transcript: [
    {
      id: 't1',
      speaker: 'Clinician',
      text: 'How has the prosthesis been feeling since our last appointment?',
      appearAtSeconds: 3,
    },
    {
      id: 't2',
      speaker: 'Patient',
      text: 'The socket feels tighter than usual, especially after I’ve been on my feet for a while.',
      appearAtSeconds: 8,
    },
    {
      id: 't3',
      speaker: 'Clinician',
      text: 'Any pain or pressure points when you walk?',
      appearAtSeconds: 15,
    },
    {
      id: 't4',
      speaker: 'Patient',
      text: 'It hurts when I walk with the prosthesis.',
      appearAtSeconds: 18,
    },
    {
      id: 't5',
      speaker: 'Clinician',
      text: 'Let’s check the residual limb skin while we have the socket off.',
      appearAtSeconds: 28,
    },
    {
      id: 't6',
      speaker: 'Patient',
      text: 'There’s a little redness on the distal end, but no open sores.',
      appearAtSeconds: 32,
    },
    {
      id: 't7',
      speaker: 'Clinician',
      text: 'We’ll watch you walk a short distance and see how the alignment looks.',
      appearAtSeconds: 40,
    },
    {
      id: 't8',
      speaker: 'Patient',
      text: 'I feel less stable on uneven ground, and I’ve been taking shorter steps.',
      appearAtSeconds: 45,
    },
    {
      id: 't9',
      speaker: 'Clinician',
      text: 'I’m adding a sock ply and adjusting the socket trim line to relieve that distal pressure.',
      appearAtSeconds: 58,
    },
    {
      id: 't10',
      speaker: 'Patient',
      text: 'That already feels better when I stand. The pressure is less sharp.',
      appearAtSeconds: 70,
    },
    {
      id: 't11',
      speaker: 'Clinician',
      text: 'Let’s reassess in two weeks. Continue daily skin checks and call if redness worsens.',
      appearAtSeconds: 82,
    },
    {
      id: 't12',
      speaker: 'Patient',
      text: 'Sounds good. I’ll keep an eye on the skin and note how walking feels.',
      appearAtSeconds: 88,
    },
  ],
  noteSections: [
    {
      id: 'reason',
      title: 'Reason for visit',
      content:
        'Prosthetic fitting and adjustment for left transtibial prosthesis due to increased socket tightness and reported discomfort with walking.',
      sourceTranscriptIds: ['t1', 't2'],
    },
    {
      id: 'symptoms',
      title: 'Patient-reported symptoms and feedback',
      content:
        'Patient reports socket feels tighter than usual with prolonged standing. States: “It hurts when I walk with the prosthesis.” After adjustment, patient reports standing pressure feels less sharp.',
      sourceTranscriptIds: ['t2', 't4', 't10'],
      isAmbiguous: true,
    },
    {
      id: 'fit-skin',
      title: 'Fit, comfort, and skin observations',
      content:
        'Socket fit described as tighter with activity. Residual limb skin: mild distal-end redness reported; no open sores documented in conversation.',
      sourceTranscriptIds: ['t2', 't6'],
    },
    {
      id: 'mobility',
      title: 'Mobility / functional observations',
      content:
        'Patient reports reduced stability on uneven ground and shorter step length. In-clinic gait observation discussed; detailed objective gait metrics were not documented.',
      sourceTranscriptIds: ['t8'],
    },
    {
      id: 'adjustments',
      title: 'Adjustments performed',
      content:
        'Added sock ply and adjusted socket trim line to reduce distal pressure.',
      sourceTranscriptIds: ['t9'],
    },
    {
      id: 'assessment',
      title: 'Assessment / summary',
      content:
        'Socket tightness and walking-related discomfort addressed with in-visit fit adjustments. Pain location remains unspecified and requires clinician review.',
      sourceTranscriptIds: ['t4', 't9', 't10'],
      isAmbiguous: true,
    },
    {
      id: 'plan',
      title: 'Plan and follow-up',
      content:
        'Reassess in two weeks. Patient advised to continue daily skin checks and contact clinic if redness worsens.',
      sourceTranscriptIds: ['t11', 't12'],
    },
  ],
  warnings: [
    {
      id: 'w-pain-location',
      title: 'Pain location not specified',
      detail:
        'Pain was mentioned, but the location was not specified. Review the transcript and add detail if known, or acknowledge that it remains undocumented.',
      relatedSectionId: 'symptoms',
      relatedTranscriptIds: ['t3', 't4'],
      status: 'open',
    },
    {
      id: 'w-gait-metrics',
      title: 'Objective gait details limited',
      detail:
        'Mobility concerns were captured from patient report. Formal gait metrics (cadence, asymmetry measures) were not documented in this encounter transcript.',
      relatedSectionId: 'mobility',
      relatedTranscriptIds: ['t7', 't8'],
      status: 'open',
    },
  ],
}

const initialEvaluationScenario: EncounterScenario = {
  checklist: [
    {
      id: 'history',
      label: 'Relevant history',
      status: 'not-covered',
      appearAtSeconds: 10,
    },
    {
      id: 'goals',
      label: 'Patient goals',
      status: 'not-covered',
      appearAtSeconds: 25,
    },
    {
      id: 'exam',
      label: 'Clinical observations',
      status: 'not-covered',
      appearAtSeconds: 40,
    },
    {
      id: 'plan',
      label: 'Plan and follow-up',
      status: 'not-covered',
      appearAtSeconds: 55,
    },
  ],
  transcript: [
    {
      id: 'ie1',
      speaker: 'Clinician',
      text: 'Tell me what brings you in for this initial evaluation.',
      appearAtSeconds: 4,
    },
    {
      id: 'ie2',
      speaker: 'Patient',
      text: 'I’m hoping to get a better fitting device so I can walk more confidently at work.',
      appearAtSeconds: 10,
    },
    {
      id: 'ie3',
      speaker: 'Clinician',
      text: 'We’ll document your goals and baseline observations, then outline next steps.',
      appearAtSeconds: 25,
    },
    {
      id: 'ie4',
      speaker: 'Patient',
      text: 'My main goal is comfortable all-day wear without skin irritation.',
      appearAtSeconds: 40,
    },
    {
      id: 'ie5',
      speaker: 'Clinician',
      text: 'I’ll schedule a fitting follow-up once measurements are complete.',
      appearAtSeconds: 55,
    },
  ],
  noteSections: [
    {
      id: 'reason',
      title: 'Reason for visit',
      content: 'Initial evaluation to assess device fit needs and establish care goals.',
      sourceTranscriptIds: ['ie1', 'ie2'],
    },
    {
      id: 'goals',
      title: 'Patient goals',
      content:
        'Patient wants improved confidence walking at work and comfortable all-day wear without skin irritation.',
      sourceTranscriptIds: ['ie2', 'ie4'],
    },
    {
      id: 'plan',
      title: 'Plan and follow-up',
      content: 'Complete measurements and schedule a fitting follow-up.',
      sourceTranscriptIds: ['ie5'],
    },
  ],
  warnings: [
    {
      id: 'w-exam-detail',
      title: 'Exam findings incomplete',
      detail:
        'Clinical observations were discussed at a high level; specific exam measurements were not captured in the transcript.',
      relatedSectionId: 'goals',
      relatedTranscriptIds: ['ie3'],
      status: 'open',
    },
  ],
}

const followUpScenario: EncounterScenario = {
  checklist: [
    {
      id: 'progress',
      label: 'Progress since last visit',
      status: 'not-covered',
      appearAtSeconds: 8,
    },
    {
      id: 'issues',
      label: 'Current issues',
      status: 'not-covered',
      appearAtSeconds: 22,
    },
    {
      id: 'plan',
      label: 'Plan and follow-up',
      status: 'not-covered',
      appearAtSeconds: 40,
    },
  ],
  transcript: [
    {
      id: 'fu1',
      speaker: 'Clinician',
      text: 'How have things been since the last visit?',
      appearAtSeconds: 3,
    },
    {
      id: 'fu2',
      speaker: 'Patient',
      text: 'Mostly better. Still some end-of-day fatigue, but skin looks good.',
      appearAtSeconds: 8,
    },
    {
      id: 'fu3',
      speaker: 'Clinician',
      text: 'Any new pain or fit problems?',
      appearAtSeconds: 18,
    },
    {
      id: 'fu4',
      speaker: 'Patient',
      text: 'No new pain. Just want to confirm the current setup is still appropriate.',
      appearAtSeconds: 22,
    },
    {
      id: 'fu5',
      speaker: 'Clinician',
      text: 'We’ll keep the current setup and check again in one month.',
      appearAtSeconds: 40,
    },
  ],
  noteSections: [
    {
      id: 'reason',
      title: 'Reason for visit',
      content: 'Follow-up to review progress and confirm current device setup.',
      sourceTranscriptIds: ['fu1', 'fu4'],
    },
    {
      id: 'progress',
      title: 'Progress and current status',
      content:
        'Patient reports overall improvement. End-of-day fatigue persists. Skin condition reported as good. No new pain reported.',
      sourceTranscriptIds: ['fu2', 'fu4'],
    },
    {
      id: 'plan',
      title: 'Plan and follow-up',
      content: 'Maintain current setup. Reassess in one month.',
      sourceTranscriptIds: ['fu5'],
    },
  ],
  warnings: [
    {
      id: 'w-fatigue',
      title: 'Fatigue cause unclear',
      detail:
        'End-of-day fatigue was mentioned without clarifying contributing factors. Mark reviewed if no additional detail is available.',
      relatedSectionId: 'progress',
      relatedTranscriptIds: ['fu2'],
      status: 'open',
    },
  ],
}

export const scenariosByType: Record<EncounterTypeId, EncounterScenario> = {
  'initial-evaluation': initialEvaluationScenario,
  'prosthetic-fitting': prostheticFittingScenario,
  'follow-up': followUpScenario,
}

export function cloneScenario(typeId: EncounterTypeId): EncounterScenario {
  return structuredClone(scenariosByType[typeId])
}
