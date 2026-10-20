import { useCallback, useState } from 'react'
import { apiClient, type CodeRequest, type LearnRequest, type LearningResponse } from '../api/client'
import { mockApi } from '../api/mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const service = useMock ? mockApi : apiClient

export function useLearnJob() {
  const [data, setData] = useState<LearningResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (request: LearnRequest) => {
    setLoading(true); setError(null)
    try { const result = await service.learn(request); setData(result); return result }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Learning request failed'; setError(message); throw cause }
    finally { setLoading(false) }
  }, [])

  const requestCode = useCallback(async (request: CodeRequest) => {
    setLoading(true); setError(null)
    try { const result = await service.requestCode(request); setData(result); return result }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Code request failed'; setError(message); throw cause }
    finally { setLoading(false) }
  }, [])

  return { data, loading, error, run, requestCode }
}
