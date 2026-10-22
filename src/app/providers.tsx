import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useLearnJob } from '../services/useLearnJob';
import { apiClient, type LearnRequest, type LearningResponse, type QuotaResponse } from '../api/client';
import { mockApi } from '../api/mock';

export type JobStatus = 'idle' | 'running' | 'failed' | 'ready';
export type JobContextValue = {
  request: LearnRequest;
  setRequest: (request: LearnRequest) => void;
  job_id: string;
  status: JobStatus;
  progress: number;
  stage_id: number | null;
  current_stage: string | null;
  result: LearningResponse | null;
  error: string | null;
  backendConnected: boolean | null;
  runGoal: (requestOverride?: LearnRequest) => Promise<LearningResponse | undefined>;
  retry: () => Promise<LearningResponse | undefined>;
  requestCode: ReturnType<typeof useLearnJob>['requestCode'];
  codeRequestPending: boolean;
  resetGoal: () => void;
  quota: QuotaResponse | null;
};

const emptyRequest: LearnRequest = {
  goal: '',
  description: '',
  project: '',
  constraints: [],
  target_skills: [],
  wants_snippet: true,
  refresh: false,
  experience_level: 'beginner',
  tech_stack: [],
};
const JobContext = createContext<JobContextValue | null>(null);

export function AppProviders({ children }: PropsWithChildren) {
  const job = useLearnJob();
  const dataService = import.meta.env.VITE_USE_MOCK === 'true' ? mockApi : apiClient;
  const [request, setRequest] = useState<LearnRequest>(emptyRequest);
  const [storedResult, setStoredResult] = useState<LearningResponse | null>(null);
  const [quota, setQuota] = useState<QuotaResponse | null>(null);

  useEffect(() => {
    void dataService
      .quota()
      .then(setQuota)
      .catch(() => setQuota(null));
  }, [dataService]);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('devscout:last-result');
      if (cached) setStoredResult(JSON.parse(cached) as LearningResponse);
    } catch {
      setStoredResult(null);
    }
  }, []);

  useEffect(() => {
    if (!job.data) return;
    try {
      sessionStorage.setItem('devscout:last-result', JSON.stringify(job.data));
      setStoredResult(job.data);
    } catch {
      // Storage can be unavailable in private browsing; the in-memory result remains usable.
    }
  }, [job.data]);

  const runGoal = useCallback(
    async (requestOverride?: LearnRequest) => {
      const result = await job.run(requestOverride ?? request);
      return result ?? undefined;
    },
    [job, request],
  );
  const resetGoal = useCallback(() => {
    job.reset();
    setRequest(emptyRequest);
    setStoredResult(null);
    try {
      sessionStorage.removeItem('devscout:last-result');
    } catch {
      // Storage can be unavailable; the in-memory state is still cleared.
    }
  }, [job]);
  const result = job.data ?? storedResult;
  const status: JobStatus =
    job.status === 'pending' || job.status === 'running'
      ? 'running'
      : job.status === 'failed' || job.status === 'timed_out'
        ? 'failed'
        : job.status === 'completed' || result
          ? 'ready'
          : 'idle';
  const value = useMemo<JobContextValue>(
    () => ({
      request,
      setRequest,
      job_id: job.job_id,
      status,
      progress: job.progress,
      stage_id: job.stage_id,
      current_stage: job.current_stage,
      result,
      error: job.error,
      backendConnected: job.backendConnected,
      runGoal,
      retry: runGoal,
      requestCode: job.requestCode,
      codeRequestPending: job.codeRequestPending,
      resetGoal,
      quota,
    }),
    [
      request,
      job.job_id,
      status,
      job.progress,
      job.stage_id,
      job.current_stage,
      job.error,
      job.backendConnected,
      job.codeRequestPending,
      result,
      quota,
      runGoal,
      resetGoal,
      job.requestCode,
    ],
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJob() {
  const value = useContext(JobContext);
  if (!value) throw new Error('useJob must be used inside AppProviders');
  return value;
}
