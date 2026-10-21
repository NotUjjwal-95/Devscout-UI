import { useCallback, useEffect, useRef, useState } from 'react'
import { apiClient, ApiError, type CodeRequest, type LearnJob, type LearnRequest, type LearningResponse } from '../api/client'
import { mockApi } from '../api/mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const service = useMock ? mockApi : apiClient
type JobStatus = LearnJob['status'] | 'idle'

export function useLearnJob() {
  const [status, setStatus] = useState<JobStatus>('idle')
  const [job_id, setJobId] = useState('')
  const [progress, setProgress] = useState(0)
  const [stage_id, setStageId] = useState('')
  const [current_stage, setCurrentStage] = useState('')
  const [data, setData] = useState<LearningResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runToken = useRef(0)

  useEffect(() => {
    void service.health()
      .then(() => setBackendConnected(true))
      .catch(() => setBackendConnected(false))
    return () => {
      runToken.current += 1
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const cancelPrevious = () => {
    runToken.current += 1
    if (timer.current) clearTimeout(timer.current)
  }

  const run = useCallback(async (request: LearnRequest) => {
    cancelPrevious()
    const token = runToken.current
    setStatus('pending')
    setJobId('')
    setProgress(0)
    setStageId('')
    setCurrentStage('')
    setData(null)
    setError(null)
    try {
      const initial = await service.learn(request)
      if (token !== runToken.current) return undefined
      applyJob(initial)
      setJobId(initial.job_id)
      await poll(initial.job_id, token)
      return initial.result
    } catch (cause) {
      if (token === runToken.current) setFailure(cause)
      return undefined
    }
  }, [])

  const poll = useCallback(async (jobId: string, token: number, retryCount = 0): Promise<void> => {
    if (token !== runToken.current) return
    try {
      const job = await service.getJob(jobId)
      if (token !== runToken.current) return
      applyJob(job)
      setJobId(job.job_id)
      if (job.status === 'completed') {
        setData(job.result)
        return
      }
      if (job.status === 'failed' || job.status === 'timed_out') {
        setFailure(new Error(job.error ?? `Learning job ${job.status}`))
        return
      }
      timer.current = setTimeout(() => void poll(jobId, token), 2000)
    } catch (cause) {
      if (token !== runToken.current) return
      const statusCode = cause instanceof ApiError ? cause.status : undefined
      if ((statusCode === 429 || cause instanceof TypeError) && retryCount < 5) {
        timer.current = setTimeout(() => void poll(jobId, token, retryCount + 1), 3000)
        return
      }
      setFailure(new Error(retryCount >= 5 ? 'The learning service remained unavailable after five retries.' : 'The learning service could not be reached.'))
    }
  }, [])

  const requestCode = useCallback(async (request: CodeRequest) => {
    try {
      const result = await service.requestCode(request)
      setData(result)
      return result
    } catch (cause) {
      setFailure(cause)
      throw cause
    }
  }, [])

  const applyJob = (job: LearnJob) => {
    setStatus(job.status)
    setProgress(job.progress)
    setStageId(job.stage_id)
    setCurrentStage(job.current_stage)
    if (job.result) setData(job.result)
    if (job.error) setError(job.error)
  }

  const setFailure = (cause: unknown) => {
    setStatus('failed')
    setError(cause instanceof Error ? cause.message : 'Learning request failed')
  }

  return { job_id, status, progress, stage_id, current_stage, error, data, backendConnected, run, requestCode }
}
