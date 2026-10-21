import { useCallback, useEffect, useRef, useState } from 'react'
import { apiClient, type CodeRequest, type LearnRequest, type LearningResponse, type PipelineStatus } from '../api/client'
import { mockApi } from '../api/mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const service = useMock ? mockApi : apiClient

export function useLearnJob() {
  const [data, setData] = useState<LearningResponse | null>(null)
  const [pipeline, setPipeline] = useState<PipelineStatus | null>(null)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const poller = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    void service.health()
      .then(() => setBackendConnected(true))
      .catch(() => setBackendConnected(false))
    return () => {
      if (poller.current) clearInterval(poller.current)
    }
  }, [])

  const run = useCallback(async (request: LearnRequest) => {
    setLoading(true); setError(null)
    try {
      const result = await service.learn(request)
      setData(result)
      const poll = async () => {
        const status = await service.pipelineStatus(result.response_id)
        setPipeline(status)
        if (status.status === 'failed') setError(`Pipeline failed at ${status.current_stage}`)
        if (status.status !== 'running' && poller.current) clearInterval(poller.current)
      }
      const firstStatus = await service.pipelineStatus(result.response_id)
      setPipeline(firstStatus)
      if (firstStatus.status === 'failed') setError(`Pipeline failed at ${firstStatus.current_stage}`)
      if (firstStatus.status === 'running') poller.current = setInterval(() => void poll(), 1500)
      return result
    }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Learning request failed'; setError(message); throw cause }
    finally { setLoading(false) }
  }, [])

  const requestCode = useCallback(async (request: CodeRequest) => {
    setLoading(true); setError(null)
    try { const result = await service.requestCode(request); setData(result); return result }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Code request failed'; setError(message); throw cause }
    finally { setLoading(false) }
  }, [])

  return { data, pipeline, backendConnected, loading, error, run, requestCode }
}
