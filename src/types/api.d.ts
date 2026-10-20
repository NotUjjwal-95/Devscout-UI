/**
 * This file is generated from openapi.yaml by openapi-typescript.
 * Regenerate with: npm run generate:types
 */
export interface components {
  schemas: {
    LearnRequest: {
      goal: string
      project: string
      experience_level: 'beginner' | 'intermediate' | 'advanced'
      tech_stack: string[]
    }
    CodeRequest: {
      response_id: string
      wants_full_code: boolean
      attempt_code?: string
      attempt_language?: string
      answers?: { question_id: string; answer: string }[]
    }
    LearningResponse: {
      response_id: string
      learning_plan: components['schemas']['LearningPlan'] | null
      resources: components['schemas']['Resource'][]
      explanation: components['schemas']['Explanation'] | null
      snippets: components['schemas']['Snippet'][]
      concept_nodes: components['schemas']['ConceptNode'][]
      concept_edges: components['schemas']['ConceptEdge'][]
      questions: components['schemas']['Question'][]
      code_gate_decision: components['schemas']['CodeGateDecision']
      confidence_score: number
      quality_score: number
      metrics: components['schemas']['Metric'][]
    }
    LearningPlan: {
      plan_id: string
      knowledge_gaps: string[]
      learning_outcomes: string[]
      depth_level: string
      milestones: components['schemas']['Milestone'][]
    }
    Milestone: {
      milestone_id: string
      title: string
      description: string
      target_outcome: string
      estimated_duration_minutes: number | null
      is_completed: boolean
    }
    Resource: {
      resource_id: string
      url: string
      type: 'docs' | 'repo' | 'blog' | 'community' | 'paper'
      title: string
      retrieved_at: string
      reliability: number
      freshness_score: number
      level_fit: string
      uncertainty_flag: boolean
      summary: string
    }
    Explanation: {
      explanation_id: string
      topic: string
      summary: string
      sections: { title: string; content: string; citation_resource_ids: string[] }[]
      prerequisites: string[]
      concept_relationships: string[]
      real_world_examples: string[]
      confidence_score: number
    }
    Snippet: {
      snippet_id: string
      code: string
      language: string
      concept: string
      line_count: number
      explanation: string
    }
    ConceptNode: { id: string; label: string; description: string; difficulty: string }
    ConceptEdge: { source: string; target: string; relation: string }
    Question: {
      question_id: string
      concept_id: string
      question_text: string
      question_type: 'conceptual' | 'exercise' | 'explain_back'
      expected_points: string[]
    }
    CodeGateDecision: {
      decision_id: string
      level: 'EXPLAIN' | 'SNIPPET' | 'FULL' | 'REQUIRE_CHECK'
      reasons: string[]
      violations: string[]
    }
    Metric: { stage: string; latency_ms: number; tokens_in: number; tokens_out: number }
  }
}
