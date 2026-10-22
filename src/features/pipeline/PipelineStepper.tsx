import { CheckIcon } from '../../components/ui/CheckIcon';
import { useJob } from '../../app/providers';
import type { LearningResponse } from '../../api/client';
import { useEffect, useRef } from 'react';

export const stages = [
  'Developer Goal & Skill Context',
  'Intent & Learning Plan',
  'Research & Source Discovery',
  'Evidence Review',
  'Explanation & Concept Mapping',
  'Guided Project Work',
  'Understanding Check',
  'Code Assistance Gate',
  'Progress & Reflection',
];

export function PipelineStepper({ result }: { result: LearningResponse | null }) {
  const job = useJob();
  const currentRef = useRef(0);
  const jobRef = useRef(job.job_id);
  useEffect(() => {
    if (jobRef.current !== job.job_id) {
      jobRef.current = job.job_id;
      currentRef.current = 0;
    }
  }, [job.job_id]);
  currentRef.current = Math.max(currentRef.current, job.stage_id ?? 0);
  const current = currentRef.current;
  return (
    <div className="stepper">
      {stages.map((stage, index) => {
        const stageNumber = index + 1;
        const done = job.status === 'ready' || (job.status === 'running' && index < current - 1);
        const active = job.status === 'running' && index === current - 1;
        const failed = job.status === 'failed' && index === current - 1;
        const metric = [...(result?.metrics ?? [])].reverse().find((entry) => entry.stage_id === stageNumber);
        const label = metric?.stage_name || stages[index];
        return (
          <div className="step" key={stage}>
            <div className={`step-dot ${done ? 'done' : active ? 'active' : failed ? 'failed' : ''}`}>
              {done ? <CheckIcon /> : failed ? '!' : index + 1}
            </div>
            <div>
              <strong>{label}</strong>
              <p>
                {active
                  ? job.current_stage
                  : failed
                    ? (job.error ?? 'Failed')
                    : done
                      ? (metric?.stage_name ?? 'Completed')
                      : 'Waiting'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
