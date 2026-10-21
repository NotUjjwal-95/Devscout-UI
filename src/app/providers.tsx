import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { useLearnJob } from '../services/useLearnJob'
import type { LearnRequest, LearningResponse, PipelineStatus } from '../api/client'

export type JobStatus = 'idle' | 'running' | 'failed' | 'ready'
export type JobContextValue = {
  request: LearnRequest
  setRequest: (request: LearnRequest) => void
  status: JobStatus
  progress: number
  stage: string
  pipeline: PipelineStatus | null
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
    return result
  }
  const result = job.data ?? storedResult
  const status: JobStatus = job.loading || job.pipeline?.status === 'running' ? 'running' : job.error ? 'failed' : result ? 'ready' : 'idle'
  const value = useMemo<JobContextValue>(() => ({
    request, setRequest, status, progress: job.pipeline?.progress ?? (result ? 1 : 0),
    stage: job.pipeline?.current_stage ?? '', pipeline: job.pipeline, result, error: job.error,
    backendConnected: job.backendConnected, runGoal, retry: runGoal, requestCode: job.requestCode,
  }), [request, status, job.pipeline, job.error, job.backendConnected, result])

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

export function useJob() {
  const value = useContext(JobContext)
  if (!value) throw new Error('useJob must be used inside AppProviders')
  return value
}
