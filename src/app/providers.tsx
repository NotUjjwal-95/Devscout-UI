import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { useLearnJob } from '../services/useLearnJob'
import type { LearnRequest, LearningResponse } from '../api/client'

export type JobStatus = 'idle' | 'running' | 'failed' | 'ready'
export type JobContextValue = {
  request: LearnRequest
  setRequest: (request: LearnRequest) => void
  job_id: string
  status: JobStatus
  progress: number
  stage_id: string
  current_stage: string
  result: LearningResponse | null
  error: string | null
  backendConnected: boolean | null
  runGoal: () => Promise<LearningResponse | undefined>
  retry: () => Promise<LearningResponse | undefined>
  requestCode: ReturnType<typeof useLearnJob>['requestCode']
}

const emptyRequest: LearnRequest = { goal: '', description: '', experience_level: 'beginner', tech_stack: [] }
const JobContext = createContext<JobContextValue | null>(null)

export function AppProviders({ children }: PropsWithChildren) {
  const job = useLearnJob()
  const [request, setRequest] = useState<LearnRequest>(emptyRequest)
  const [storedResult, setStoredResult] = useState<LearningResponse | null>(null)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('devscout:last-result')
      if (cached) setStoredResult(JSON.parse(cached) as LearningResponse)
    } catch {
      setStoredResult(null)
    }
  }, [])

  useEffect(() => {
    if (!job.data) return
    try {
      sessionStorage.setItem('devscout:last-result', JSON.stringify(job.data))
      setStoredResult(job.data)
    } catch {
      // Storage can be unavailable in private browsing; the in-memory result remains usable.
    }
  }, [job.data])

  const runGoal = async () => {
    const result = await job.run(request)
    return result ?? undefined
  }
  const result = job.data ?? storedResult
  const status: JobStatus = job.status === 'pending' || job.status === 'running' ? 'running' : job.status === 'failed' || job.status === 'timed_out' ? 'failed' : job.status === 'completed' || result ? 'ready' : 'idle'
  const value = useMemo<JobContextValue>(() => ({
    request, setRequest, job_id: job.job_id, status, progress: job.progress, stage_id: job.stage_id, current_stage: job.current_stage, result, error: job.error,
    backendConnected: job.backendConnected, runGoal, retry: runGoal, requestCode: job.requestCode,
  }), [request, job.job_id, status, job.progress, job.stage_id, job.current_stage, job.error, job.backendConnected, result])

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

export function useJob() {
  const value = useContext(JobContext)
  if (!value) throw new Error('useJob must be used inside AppProviders')
  return value
}
