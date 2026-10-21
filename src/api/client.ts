import type { components } from '../types/api'

export type LearningResponse = components['schemas']['LearningResponse']
export type LearnRequest = components['schemas']['LearnRequest']
export type CodeRequest = components['schemas']['CodeRequest']
export type HealthResponse = components['schemas']['HealthResponse']
export type PipelineStatus = components['schemas']['PipelineStatus']

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`Backend request failed (${response.status})`)
  return response.json() as Promise<T>
}

export const apiClient = {
  learn: (body: LearnRequest) => post<LearningResponse>('/api/learn', body),
  requestCode: (body: CodeRequest) => post<LearningResponse>('/api/code-request', body),
  health: () => get<HealthResponse>('/health'),
  pipelineStatus: (responseId: string) => get<PipelineStatus>(`/api/learn/${encodeURIComponent(responseId)}/status`),
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) throw new Error(`Backend request failed (${response.status})`)
  return response.json() as Promise<T>
}
