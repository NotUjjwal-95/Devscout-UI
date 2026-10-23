import { act, renderHook } from '@testing-library/react';
import { createElement, type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLearnJob } from './useLearnJob';
import { AppProviders, useJob } from '../app/providers';

const request = {
  goal: 'Learn React',
  description: 'Build a task board',
  experience_level: 'beginner' as const,
  tech_stack: ['React'],
  wants_snippet: true,
  refresh: false,
};
const result = { response_id: 'response-1' } as never;
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
});

describe('useLearnJob', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.restoreAllMocks();
  });

  it('polls pending, running, then completed', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('pending', null))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('running', 2))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))));
    const { result: hook } = renderHook(() => useLearnJob());
    let runPromise: Promise<unknown>;
    await act(async () => {
      runPromise = hook.current.run(request);
      await Promise.resolve();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    await runPromise!;
    expect(hook.current.status).toBe('completed');
    expect(hook.current.data).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('sets an error when the job fails', async () => {
    const partial = { ...job('failed', 2), result };
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('pending', null))))
      .mockResolvedValueOnce(new Response(JSON.stringify(partial)));
    const { result: hook } = renderHook(() => useLearnJob());
    await act(async () => {
      await hook.current.run(request);
    });
    expect(hook.current.status).toBe('failed');
    expect(hook.current.error).toBe('Backend failed');
    expect(hook.current.data).toEqual(result);
  });

  it('surfaces job expired for a 404 poll', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('pending', null))))
      .mockResolvedValueOnce(new Response('', { status: 404 }));
    const { result: hook } = renderHook(() => useLearnJob());
    await act(async () => {
      await hook.current.run(request);
    });
    expect(hook.current.error).toContain('expired');
  });

  it('retries a 429 before succeeding', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response('', { status: 429 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))));
    const { result: hook } = renderHook(() => useLearnJob());
    let run: Promise<unknown>;
    await act(async () => {
      run = hook.current.run(request);
      await Promise.resolve();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    await run!;
    expect(hook.current.status).toBe('completed');
  });

  it('cancels an old run and stops after unmount', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('running', 1))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('pending', null))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))));
    const { result: hook, unmount } = renderHook(() => useLearnJob());
    await act(async () => {
      void hook.current.run(request);
      await Promise.resolve();
    });
    const calls = fetchMock.mock.calls.length;
    await act(async () => {
      await hook.current.run(request);
    });
    expect(hook.current.status).toBe('completed');
    unmount();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    expect(fetchMock.mock.calls.length).toBeGreaterThan(calls);
  });

  it('supports the EXPLAIN to REQUIRE_CHECK to FULL gate flow', async () => {
    const check = {
      response_id: 'response-1',
      questions: [{ question_id: 'q1' }],
      code_gate_decision: { level: 'REQUIRE_CHECK' },
    };
    const full = { ...check, full_code: 'console.log("ready")', code_gate_decision: { level: 'FULL' } };
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(check)))
      .mockResolvedValueOnce(new Response(JSON.stringify(full)));
    const { result: hook } = renderHook(() => useLearnJob());
    await act(async () => {
      await hook.current.requestCode({ response_id: 'response-1', wants_full_code: false });
    });
    expect(hook.current.data).toEqual(check);
    await act(async () => {
      await hook.current.requestCode({
        response_id: 'response-1',
        wants_full_code: true,
        answers: [{ question_id: 'q1', answer: 'understood' }],
      });
    });
    expect(hook.current.data).toEqual(full);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('reset clears the current job and result', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))));
    const { result: hook } = renderHook(() => useLearnJob());
    await act(async () => {
      await hook.current.run(request);
    });
    expect(hook.current.data).toEqual(result);
    act(() => hook.current.reset());
    expect(hook.current.status).toBe('idle');
    expect(hook.current.data).toBeNull();
    expect(hook.current.error).toBeNull();
  });

  it('clears the previous result before a new job completes', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}'))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('completed', 9, result))))
      .mockResolvedValueOnce(new Response(JSON.stringify(job('pending', null))));
    const { result: hook, unmount } = renderHook(() => useLearnJob());

    await act(async () => {
      await hook.current.run(request);
    });
    expect(hook.current.data).toEqual(result);

    act(() => {
      void hook.current.run(request);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(hook.current.status).toBe('pending');
    expect(hook.current.data).toBeNull();
    unmount();
  });

  it('new goal reset clears the request and cached session result', () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    sessionStorage.setItem('devscout:last-result', JSON.stringify(result));
    const wrapper = ({ children }: PropsWithChildren) => createElement(AppProviders, null, children);
    const { result: context } = renderHook(() => useJob(), { wrapper });
    act(() => {
      context.current.setRequest({ ...request, goal: 'Changed goal' });
      context.current.resetGoal();
    });
    expect(context.current.request.goal).toBe('');
    expect(context.current.result).toBeNull();
    expect(sessionStorage.getItem('devscout:last-result')).toBeNull();
  });
});
