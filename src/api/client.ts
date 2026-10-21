import type { components } from '../types/api'

export type LearningResponse = components['schemas']['LearningResponse']
export type LearnRequest = components['schemas']['LearnRequest']
export type CodeRequest = components['schemas']['CodeRequest']
export type HealthResponse = components['schemas']['HealthResponse']
export type LearnJobRecord = components['schemas']['LearnJobRecord']
export type QuotaResponse = {
  used?: number
  limit?: number
  remaining?: number
  tokens_used?: number
  tokens_limit?: number
  cost?: number
  currency?: string
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const apiKey = import.meta.env.VITE_API_KEY

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (apiKey) headers['X-API-Key'] = apiKey
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new ApiError(messageForStatus(response.status, path), response.status)
  return response.json() as Promise<T>
}

export const apiClient = {
  learn: (body: LearnRequest) => post<LearnJobRecord>('/api/learn', body),
  requestCode: (body: CodeRequest) => post<LearningResponse>('/api/code-request', body),
  health: () => get<HealthResponse>('/health'),
  quota: () => get<QuotaResponse>('/api/quota'),
  getJob: (jobId: string) => get<LearnJobRecord>(`/api/learn/${encodeURIComponent(jobId)}`),
}

async function get<T>(path: string): Promise<T> {
  const headers: HeadersInit = {}
  if (apiKey) headers['X-API-Key'] = apiKey
  const response = await fetch(`${baseUrl}${path}`, { headers })
  if (!response.ok) throw new ApiError(messageForStatus(response.status, path), response.status)
  return response.json() as Promise<T>
}

function messageForStatus(status: number, path: string) {
  if (status === 401) return 'Authentication failed. Check the API key.'
  if (status === 403) return 'You are not allowed to access this learning service.'
  if (status === 404 && path.startsWith('/api/learn/')) return 'This learning job expired or no longer exists.'
  if (status === 404) return 'The requested backend endpoint was not found.'
  if (status === 429) return 'The learning service is busy. Please retry shortly.'
  if (status >= 500) return 'The learning service encountered a server error.'
  return `Backend request failed (${status})`
}
