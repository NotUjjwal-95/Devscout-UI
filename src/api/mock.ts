import type { CodeRequest, LearnJobRecord, LearnRequest, LearningResponse } from './client'

const response: LearningResponse = {
  response_id: 'resp-react-query-001',
  generated_at: '2026-10-20T08:00:00Z',
  from_cache: false,
  warnings: [{ severity: 'warning', message: 'One community source needs version-specific verification.' }],
  evidence_status: 'accepted_with_uncertainty',
  evidence_summary: { discovered: 7, fetched: 6, accepted: 4, rejected: [{ url: 'https://example.invalid/old-query-guide', reason: 'Could not verify retrieval timestamp.' }] },
  learning_plan: {
    plan_id: 'plan-query-cache',
    knowledge_gaps: ['Cache invalidation semantics', 'Optimistic update rollback'],
    learning_outcomes: ['Explain query freshness', 'Ship a safe optimistic mutation'],
    depth_level: 'intermediate',
    milestones: [
      { milestone_id: 'm1', title: 'Understand query invalidation', description: 'Map stale data to explicit invalidation events.', target_outcome: 'You can choose when a query should refetch.', estimated_duration_minutes: 25, is_completed: true },
      { milestone_id: 'm2', title: 'Ship optimistic updates', description: 'Practice update, rollback, and refetch sequencing.', target_outcome: 'You can build a resilient mutation flow.', estimated_duration_minutes: 40, is_completed: false },
    ],
  },
  resources: [
    { resource_id: 'r1', url: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation', type: 'docs', title: 'Query Invalidation | TanStack Query', retrieved_at: '2026-10-20T08:00:00Z', reliability: 0.98, freshness_score: 0.96, level_fit: 'Intermediate', uncertainty_flag: false, summary: 'Canonical guidance on marking cached queries stale and refetching.' },
    { resource_id: 'r2', url: 'https://react.dev/learn', type: 'docs', title: 'Learn React', retrieved_at: '2026-10-20T08:00:00Z', reliability: 0.99, freshness_score: 0.94, level_fit: 'Beginner → Advanced', uncertainty_flag: false, summary: 'Official React mental models for state, effects, and UI updates.' },
    { resource_id: 'r3', url: 'https://github.com/TanStack/query', type: 'repo', title: 'TanStack Query repository', retrieved_at: '2026-10-20T08:00:00Z', reliability: 0.95, freshness_score: 0.91, level_fit: 'Intermediate', uncertainty_flag: false, summary: 'Reference implementation and changelog for the query cache.' },
    { resource_id: 'r4', url: 'https://tkdodo.eu/blog/mastering-mutations-in-react-query', type: 'blog', title: 'Mastering Mutations in React Query', retrieved_at: '2026-10-20T08:00:00Z', reliability: 0.72, freshness_score: 0.69, level_fit: 'Intermediate', uncertainty_flag: true, summary: 'Practical patterns for mutations; verify version-specific details against official docs.' },
  ],
  explanation: {
    explanation_id: 'explain-invalidation',
    topic: 'Query invalidation is a promise about freshness',
    summary: 'A query cache is useful because it can be stale without being useless. Invalidation marks a known piece of data as needing reconciliation with the server.',
    sections: [
      { title: 'Mark stale, then reconcile', content: 'Invalidation does not delete data. It marks matching queries stale and lets active observers refetch, which keeps the UI responsive while restoring server truth.', citation_resource_ids: ['r1', 'r2'] },
      { title: 'Keep the mutation boundary explicit', content: 'Put invalidation beside the mutation that changes the underlying record. This makes the relationship observable and avoids scattering cache policy through rendering code.', citation_resource_ids: ['r1', 'r3'] },
    ],
    prerequisites: ['React state and effects', 'HTTP request lifecycle'],
    concept_relationships: ['mutation → invalidation → refetch', 'stale cache → active observer'],
    real_world_examples: ['Refreshing a task list after creating a task', 'Reconciling a profile after a settings mutation'],
    confidence_score: 0.91,
  },
  snippets: [
    { snippet_id: 'snippet-invalidate', code: "const createTask = useMutation({\n  mutationFn: saveTask,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: ['tasks'] });\n  },\n});", language: 'tsx', concept: 'Invalidate related data after a successful mutation', line_count: 6, explanation: 'The mutation owns the cache consequence. Only the related tasks query is marked stale, so active screens can reconcile without inventing a new data source.' },
  ],
  concept_nodes: [
    { id: 'mutation', label: 'Mutation', description: 'A write that changes server state.', difficulty: 'intermediate' },
    { id: 'invalidate', label: 'Invalidate', description: 'Mark related cached data as stale.', difficulty: 'intermediate' },
    { id: 'refetch', label: 'Refetch', description: 'Reconcile active observers with the server.', difficulty: 'intermediate' },
  ],
  concept_edges: [
    { source: 'mutation', target: 'invalidate', relation: 'triggers' },
    { source: 'invalidate', target: 'refetch', relation: 'enables' },
  ],
  questions: [
    { question_id: 'q1', concept_id: 'invalidate', question_text: 'Why is invalidation safer than manually editing every cached task list?', question_type: 'conceptual' },
    { question_id: 'q2', concept_id: 'mutation', question_text: 'Describe what should happen if saveTask succeeds but the refetch fails.', question_type: 'explain_back' },
  ],
  code_gate_decision: { decision_id: 'gate-001', level: 'REQUIRE_CHECK', reasons: ['Full implementation is gated until the cache boundary is explained.', 'A short understanding check helps verify transfer to the learner project.'], violations: [] },
  confidence_score: 0.91,
  quality_score: 0.89,
  metrics: [
    { stage_id: '1', stage_name: 'Goal context', prompt_tokens: 642, completion_tokens: 1130, model_id: 'mock-research' },
    { stage_id: '2', stage_name: 'Synthesis', prompt_tokens: 1130, completion_tokens: 980, model_id: 'mock-synthesis' },
    { stage_id: '9', stage_name: 'Code gate', prompt_tokens: 220, completion_tokens: 95, model_id: 'mock-gate' },
  ],
}

const jobs = new Map<string, { job: LearnJobRecord; startedAt: number }>()

export const mockApi = {
  async health() {
    await new Promise((resolve) => setTimeout(resolve, 120))
    return { status: 'ok' as const }
  },
  async learn(_body: LearnRequest) {
    const jobId = `mock-job-${Date.now()}`
    const job: LearnJobRecord = { job_id: jobId, status: 'pending', progress: 0, current_stage: 'Queued', stage_id: 0, result: null, error: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    jobs.set(jobId, { job, startedAt: Date.now() })
    return structuredClone(job)
  },
  async getJob(jobId: string) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    const entry = jobs.get(jobId)
    if (!entry) throw new Error('Mock job not found')
    const stage = Math.min(Math.floor((Date.now() - entry.startedAt) / 800), 9)
    entry.job = { ...entry.job, status: stage >= 9 ? 'completed' : 'running', progress: stage / 9, stage_id: stage, current_stage: stage >= 9 ? 'Complete' : `Stage ${stage}`, result: stage >= 9 ? structuredClone(response) : null, updated_at: new Date().toISOString() }
    return structuredClone(entry.job)
  },
  async requestCode(body: CodeRequest) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const next = structuredClone(response)
    if (body.answers?.every((answer) => answer.answer.trim().length > 12) || body.attempt_code?.trim()) {
      next.code_gate_decision = { decision_id: 'gate-002', level: 'FULL', reasons: ['You connected invalidation to the mutation boundary and described the failure mode.'], violations: [] }
      next.snippets = [{ ...next.snippets[0], code: "const createTask = useMutation({\n  mutationFn: saveTask,\n  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),\n  onError: (error) => reportMutationFailure(error),\n});\n\nexport function TaskComposer() {\n  const mutation = createTask;\n  return <button onClick={() => mutation.mutate({ title: 'Learn' })}>Save task</button>;\n}", line_count: 9 }]
    }
    return next
  },
}
