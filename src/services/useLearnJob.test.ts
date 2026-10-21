import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLearnJob } from './useLearnJob'

const request = { goal: 'Learn React', description: 'Build a task board', experience_level: 'beginner' as const, tech_stack: ['React'] }
const result = { response_id: 'response-1' } as never
const job = (status: 'pending' | 'running' | 'completed' | 'failed', stage_id: number | null, resultValue = null) => ({
  job_id: 'job-1',
  status,
  progress: stage_id ? stage_id / 9 : 0,
  current_stage: stage_id ? `Stage ${stage_id}` : null,
  stage_id,
  result: resultValue,
  error: status === 'failed' ? 'Backend failed' : null,
  created_at: '',
  updated_at: '',
})

describe('useLearnJob', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubEnv('VITE_USE_MOCK', 'false')
    vi.restoreAllMocks()
  })

  it('polls pending, running, then completed', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('pending', null))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('running', 2))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))))
    const { result: hook } = renderHook(() => useLearnJob())
    let runPromise: Promise<unknown>
    await act(async () => {
      runPromise = hook.current.run(request)
      await Promise.resolve()
    })
    await act(async () => { await vi.advanceTimersByTimeAsync(4000) })
    await runPromise!
    expect(hook.current.status).toBe('completed')
    expect(hook.current.data).toEqual(result)
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('sets an error when the job fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('{}')).mockResolvedValueOnce(new Response(JSON.stringify(job('failed', 2))))
    const { result: hook } = renderHook(() => useLearnJob())
    await act(async () => { await hook.current.run(request) })
    expect(hook.current.status).toBe('failed')
    expect(hook.current.error).toBe('Backend failed')
  })

  it('retries a 429 before succeeding', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('{}')).mockResolvedValueOnce(new Response('', { status: 429 })).mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))))
    const { result: hook } = renderHook(() => useLearnJob())
    let run: Promise<unknown>
    await act(async () => { run = hook.current.run(request); await Promise.resolve() })
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    await run!
    expect(hook.current.status).toBe('completed')
  })

  it('cancels an old run and stops after unmount', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(job('running', 1))))
    const { result: hook, unmount } = renderHook(() => useLearnJob())
    await act(async () => { void hook.current.run(request); await Promise.resolve() })
    const calls = fetchMock.mock.calls.length
    unmount()
    await act(async () => { await vi.advanceTimersByTimeAsync(10000) })
    expect(fetchMock.mock.calls.length).toBe(calls)
  })
})
