import type { Screen } from '../types'

interface WorkflowStepperProps {
  screen: Screen
  finalized: boolean
}

const steps: { id: Screen; label: string }[] = [
  { id: 'setup', label: '1. Setup' },
  { id: 'encounter', label: '2. Encounter' },
  { id: 'review', label: '3. Review' },
]

export function WorkflowStepper({ screen, finalized }: WorkflowStepperProps) {
  const order: Screen[] = ['setup', 'encounter', 'review']
  const currentIndex = order.indexOf(screen)

  return (
    <nav className="stepper" aria-label="Encounter workflow steps">
      {steps.map((step, index) => {
        const isActive = step.id === screen
        const isDone =
          index < currentIndex || (step.id === 'review' && finalized)
        return (
          <span
            key={step.id}
            className={`step${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
          >
            {step.label}
          </span>
        )
      })}
    </nav>
  )
}
