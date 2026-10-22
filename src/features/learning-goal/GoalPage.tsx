import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { useJob } from '../../app/providers';
import { PlayIcon } from '../../components/ui/icons';
import type { LearnRequest } from '../../api/client';

const example: LearnRequest = {
  goal: 'Build a resilient React data layer',
  description: 'A task board with optimistic updates',
  project: 'Task board',
  constraints: [],
  target_skills: ['cache invalidation'],
  wants_snippet: true,
  refresh: false,
  experience_level: 'intermediate',
  tech_stack: ['React', 'TypeScript'],
};
const empty: LearnRequest = { goal: '', description: '', experience_level: 'beginner', tech_stack: [] };
const GOAL_LIMIT = 1000;
const CONTEXT_LIMIT = 2000;

export function GoalPage() {
  const job = useJob();
  const [tag, setTag] = useState('');
  const [exampleUsed, setExampleUsed] = useState(false);
  const goalOverLimit = job.request.goal.length > GOAL_LIMIT;
  const contextOverLimit = job.request.description.length > CONTEXT_LIMIT;
  const hasInvalidText = !job.request.goal.trim() || !job.request.description.trim();
  const submitDisabled = goalOverLimit || contextOverLimit || hasInvalidText || job.status === 'running';
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitDisabled) return;
    void job.runGoal({
      ...job.request,
      goal: job.request.goal.trim(),
      description: job.request.description.trim(),
      project: job.request.project?.trim() || undefined,
    });
  };
  const addTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tag.trim()) {
      event.preventDefault();
      job.setRequest({ ...job.request, tech_stack: [...job.request.tech_stack, tag.trim()] });
      setTag('');
    }
  };
  return (
    <div className="goal-page">
      <section>
        <h2>
          Learn while
          <br />
          you build.
        </h2>
        <p>
          A guided path from your next project idea to the concepts, sources, and practice you need to ship with
          confidence.
        </p>
      </section>
      <form className="panel goal-form" onSubmit={submit}>
        <div className="form-heading">
          <div>
            <p className="eyebrow">START A LEARNING JOB</p>
            <h3>What are you building?</h3>
          </div>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              job.setRequest(example);
              setExampleUsed(true);
            }}
          >
            Use an example
          </button>
        </div>
        <label>
          Learning goal
          <AutoGrowTextarea
            required
            className="field"
            value={job.request.goal}
            onChange={(e) => job.setRequest({ ...job.request, goal: e.target.value })}
            placeholder="e.g. understand async state"
            rows={3}
          />
          <Counter value={job.request.goal.length} limit={GOAL_LIMIT} />
        </label>
        <label>
          Project name
          <input
            className="field"
            value={job.request.project ?? ''}
            onChange={(e) => job.setRequest({ ...job.request, project: e.target.value })}
            placeholder="e.g. Task board"
          />
        </label>
        <label>
          Project context
          <AutoGrowTextarea
            required
            className="field"
            value={job.request.description}
            onChange={(e) => job.setRequest({ ...job.request, description: e.target.value })}
            placeholder="e.g. a task board with optimistic updates"
            rows={3}
          />
          <Counter value={job.request.description.length} limit={CONTEXT_LIMIT} />
        </label>
        <label>
          Experience
          <select
            className="field"
            value={job.request.experience_level}
            onChange={(e) =>
              job.setRequest({ ...job.request, experience_level: e.target.value as LearnRequest['experience_level'] })
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label>
          Model
          <select
            className="field"
            value={job.request.model_id ?? ''}
            onChange={(e) => job.setRequest({ ...job.request, model_id: e.target.value || undefined })}
          >
            <option value="">Backend choice</option>
            {job.models?.map((model) => (
              <option key={model.id} value={model.id} disabled={!model.available}>
                {model.label}
                {!model.available ? ' (unavailable)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tech stack
          <div className="field tags">
            {job.request.tech_stack.map((item) => (
              <span className="tag" key={item}>
                {item}
                <button
                  type="button"
                  onClick={() =>
                    job.setRequest({
                      ...job.request,
                      tech_stack: job.request.tech_stack.filter((tagName) => tagName !== item),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add and press Enter"
            />
          </div>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={job.request.refresh ?? false}
            onChange={(e) => job.setRequest({ ...job.request, refresh: e.target.checked })}
          />{' '}
          Refresh evidence
        </label>
        {job.error && (
          <p className="error-text" role="alert">
            {job.error}
          </p>
        )}
        {goalOverLimit && (
          <p className="error-text" role="alert">
            Learning goal must be 1000 characters or fewer.
          </p>
        )}
        {contextOverLimit && (
          <p className="error-text" role="alert">
            Project context must be 2000 characters or fewer.
          </p>
        )}
        <button className="button-primary" type="submit" disabled={submitDisabled}>
          <PlayIcon />
          Start learning
        </button>
        {exampleUsed && <small>Example loaded. Edit it before starting.</small>}
      </form>
    </div>
  );
}

function Counter({ value, limit }: { value: number; limit: number }) {
  return (
    <small className={value > limit ? 'character-counter over-limit' : 'character-counter'}>
      {value}/{limit}
    </small>
  );
}

function AutoGrowTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, window.innerHeight * 0.4)}px`;
  }, [props.value]);
  return <textarea {...props} ref={ref} />;
}

export const emptyRequest = empty;
