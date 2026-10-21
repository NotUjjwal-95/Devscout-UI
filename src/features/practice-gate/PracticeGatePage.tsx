import { useState } from 'react'
import { RouteState } from '../../app/App'
import { useJob } from '../../app/providers'
import { SendIcon } from '../../components/ui/icons'

export function PracticeGatePage() { return <RouteState><PracticeReady /></RouteState> }
function PracticeReady() {
  const job = useJob()
  const result = job.result!
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attempt, setAttempt] = useState('')
  const submit = (wantsFullCode: boolean) => void job.requestCode({ response_id: result.response_id, wants_full_code: wantsFullCode, answers: result.questions.map((question) => ({ question_id: question.question_id, answer: answers[question.question_id] ?? '' })), attempt_code: attempt || undefined, attempt_language: attempt ? 'tsx' : undefined })
  return <div className="panel"><p className="eyebrow">CODE ASSISTANCE GATE</p><h2>{result.code_gate_decision.level}</h2>{result.code_gate_decision.reasons.map((reason) => <p key={reason}>{reason}</p>)}{result.code_gate_decision.violations.map((violation) => <p className="error-text" key={violation}>{violation}</p>)}{result.snippets.map((snippet) => <pre key={snippet.snippet_id}><code>{snippet.code}</code></pre>)}{result.full_code && <><p>{result.code_notice}</p><p>Unlocked by: {result.unlocked_by}</p><pre><code>{result.full_code}</code></pre></>}{result.questions.map((question) => <label className="question" key={question.question_id}>{question.question_text}<textarea className="field" value={answers[question.question_id] ?? ''} onChange={(e) => setAnswers({ ...answers, [question.question_id]: e.target.value })} /></label>)}<textarea className="field" placeholder="Optional attempt" value={attempt} onChange={(e) => setAttempt(e.target.value)} /><div className="actions"><button className="button-secondary" onClick={() => submit(false)}><SendIcon />Submit answers</button><button className="button-primary" onClick={() => submit(true)}>Request full code</button></div></div>
}
