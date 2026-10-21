import { CheckIcon } from '../../components/ui/CheckIcon'
import { useJob } from '../../app/providers'
import type { LearningResponse } from '../../api/client'

export const stages = ['Goal context', 'Knowledge gaps', 'Research', 'Source review', 'Concept synthesis', 'Learning plan', 'Explanation', 'Code gate', 'Complete']

export function PipelineStepper({ result }: { result: LearningResponse | null }) {
  const job = useJob()
  const current = job.stage_id ?? 0
  return <div className="stepper">{stages.map((stage, index) => { const done = job.status === 'completed' || index < current - 1; const active = index === current - 1; const metric = result?.metrics?.[index]; return <div className="step" key={stage}><div className={`step-dot ${done ? 'done' : active ? 'active' : ''}`}>{done ? <CheckIcon /> : index + 1}</div><div><strong>{stage}</strong><p>{active ? job.current_stage : done ? metric?.stage_name ?? 'Completed' : 'Waiting'}</p></div></div> })}</div>
}
