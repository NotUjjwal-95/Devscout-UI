import type { components } from '../types/api'

export type LearningResponse = components['schemas']['LearningResponse']
export type LearnRequest = components['schemas']['LearnRequest']
export type CodeRequest = components['schemas']['CodeRequest']
export type HealthResponse = components['schemas']['HealthResponse']
export type LearnJob = components['schemas']['LearnJob']

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new ApiError(`Backend request failed (${response.status})`, response.status)
  return response.json() as Promise<T>
}

export const apiClient = {
  learn: (body: LearnRequest) => post<LearnJob>('/api/learn', body),
  requestCode: (body: CodeRequest) => post<LearningResponse>('/api/code-request', body),
  health: () => get<HealthResponse>('/health'),
  getJob: (jobId: string) => get<LearnJob>(`/api/learn/${encodeURIComponent(jobId)}`),
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) throw new ApiError(`Backend request failed (${response.status})`, response.status)
  return response.json() as Promise<T>
}
