import { useState } from 'react';
import { RouteState } from '../learning-goal/RouteState';
import { useJob } from '../../app/providers';
import { SendIcon } from '../../components/ui/icons';

const languages = ['python', 'tsx', 'ts', 'js'] as const;

export function PracticeGatePage() {
  return (
    <RouteState>
      <PracticeReady />
    </RouteState>
  );
}

function PracticeReady() {
  const job = useJob();
  const result = job.result!;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState('');
  const [language, setLanguage] = useState<(typeof languages)[number]>('tsx');
  const [copied, setCopied] = useState(false);

  const submit = async (wantsFullCode: boolean) => {
    await job.requestCode({
      response_id: result.response_id ?? '',
      wants_full_code: wantsFullCode,
      answers: (result.questions ?? []).map((question) => {
        const questionId = question.question_id ?? question.concept_id ?? '';
        return { question_id: questionId, answer: answers[questionId] ?? '' };
      }),
      attempt_code: attempt.trim() || undefined,
      attempt_language: attempt.trim() ? language : undefined,
    });
  };

  const copyCode = async () => {
    if (!result.full_code) return;
    await navigator.clipboard.writeText(result.full_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const feedback =
    typeof result.understanding_result === 'string'
      ? result.understanding_result
      : result.understanding_result?.feedback;

  return (
    <div className="panel">
      <p className="eyebrow">CODE ASSISTANCE GATE</p>
      <h2>{result.code_gate_decision.level}</h2>
      <div className="gate-details">
        {(result.code_gate_decision.reasons ?? []).map((reason) => (
          <p key={reason}>{reason}</p>
        ))}
        {(result.code_gate_decision.violations ?? []).map((violation) => (
          <p className="error-text" key={violation}>
            {violation}
          </p>
        ))}
      </div>
      {(result.snippets ?? []).map((snippet) => (
        <div key={snippet.snippet_id}>
          <pre>
            <code>{snippet.code}</code>
          </pre>
          <p>{snippet.explanation}</p>
        </div>
      ))}
      {(result.questions ?? []).length > 0 && (
        <section>
          <h3>Understanding check</h3>
          {(result.questions ?? []).map((question) => (
            <label className="question" key={question.question_id ?? question.concept_id}>
              {question.question_text}
              <textarea
                className="field"
                value={answers[question.question_id ?? question.concept_id ?? ''] ?? ''}
                onChange={(event) =>
                  setAnswers({ ...answers, [question.question_id ?? question.concept_id ?? '']: event.target.value })
                }
              />
            </label>
          ))}
        </section>
      )}
      {feedback && (
        <div className="state-panel">
          <strong>Feedback</strong>
          <p>{feedback}</p>
        </div>
      )}
      {result.understanding_result &&
        typeof result.understanding_result !== 'string' &&
        result.understanding_result.score !== undefined && (
          <p>Understanding score: {result.understanding_result.score}</p>
        )}
      <label>
        My attempt (optional)
        <textarea
          className="field"
          value={attempt}
          onChange={(event) => setAttempt(event.target.value)}
          placeholder="Explain or implement your approach here"
        />
      </label>
      {attempt.trim() && (
        <label>
          Attempt language
          <select
            className="field"
            value={language}
            onChange={(event) => setLanguage(event.target.value as (typeof languages)[number])}
          >
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      )}
      <div className="actions">
        <button className="button-secondary" disabled={job.codeRequestPending} onClick={() => void submit(false)}>
          <SendIcon />
          {job.codeRequestPending ? 'Submitting…' : 'Submit answers'}
        </button>
        <button className="button-primary" disabled={job.codeRequestPending} onClick={() => void submit(true)}>
          {job.codeRequestPending ? 'Requesting…' : 'Request full code'}
        </button>
      </div>
      {result.full_code && (
        <section>
          <h3>Full code</h3>
          {result.code_notice && <p>{result.code_notice}</p>}
          {result.unlocked_by && <p>Unlocked by: {result.unlocked_by}</p>}
          <button className="button-secondary" onClick={() => void copyCode()}>
            {copied ? 'Copied' : 'Copy code'}
          </button>
          <pre>
            <code>{result.full_code}</code>
          </pre>
        </section>
      )}
    </div>
  );
}
