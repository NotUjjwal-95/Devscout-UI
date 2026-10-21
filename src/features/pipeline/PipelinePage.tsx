import { RouteState } from '../../app/App'
import { useJob } from '../../app/providers'
import { PipelineStepper } from './PipelineStepper'

export function PipelinePage() { return <RouteState><PipelineReady /></RouteState> }
function PipelineReady() {
  const job = useJob()
  const current = job.stage_id ?? 0
  return <div className="panel"><p className="eyebrow">JOB PIPELINE</p><h2>9-stage learning pipeline</h2><PipelineStepper result={job.data} /></div>
}
