import { useState } from 'react'
import { useJob } from '../../app/providers'
import { PlayIcon } from '../../components/ui/icons'
import type { LearnRequest } from '../../api/client'

const example: LearnRequest = { goal: 'Build a resilient React data layer', description: 'A task board with optimistic updates', project: 'Task board', constraints: [], target_skills: ['cache invalidation'], wants_snippet: true, refresh: false, experience_level: 'intermediate', tech_stack: ['React', 'TypeScript'] }
const empty: LearnRequest = { goal: '', description: '', experience_level: 'beginner', tech_stack: [] }

export function GoalPage() {
  const job = useJob()
  const [tag, setTag] = useState('')
  const [exampleUsed, setExampleUsed] = useState(false)
  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tag.trim()) {
      event.preventDefault()
      job.setRequest({ ...job.request, tech_stack: [...job.request.tech_stack, tag.trim()] })
      setTag('')
    }
  }
  return <div className="goal-page"><section><h2>Learn while<br />you build.</h2><p>A guided path from your next project idea to the concepts, sources, and practice you need to ship with confidence.</p></section><form className="panel goal-form" onSubmit={(event) => { event.preventDefault(); void job.runGoal() }}><div className="form-heading"><div><p className="eyebrow">START A LEARNING JOB</p><h3>What are you building?</h3></div><button type="button" className="button-secondary" onClick={() => { job.setRequest(example); setExampleUsed(true) }}>Use an example</button></div><label>Learning goal<input required className="field" value={job.request.goal} onChange={(e) => job.setRequest({ ...job.request, goal: e.target.value })} placeholder="e.g. understand async state" /></label><label>Project name<input className="field" value={job.request.project ?? ''} onChange={(e) => job.setRequest({ ...job.request, project: e.target.value })} placeholder="e.g. Task board" /></label><label>Project context<textarea required className="field" value={job.request.description} onChange={(e) => job.setRequest({ ...job.request, description: e.target.value })} placeholder="e.g. a task board with optimistic updates" /></label><label>Experience<select className="field" value={job.request.experience_level} onChange={(e) => job.setRequest({ ...job.request, experience_level: e.target.value as LearnRequest['experience_level'] })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>Tech stack<div className="field tags">{job.request.tech_stack.map((item) => <span className="tag" key={item}>{item}<button type="button" onClick={() => job.setRequest({ ...job.request, tech_stack: job.request.tech_stack.filter((tagName) => tagName !== item) })}>×</button></span>)}<input value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={addTag} placeholder="Add and press Enter" /></div></label><label className="toggle"><input type="checkbox" checked={job.request.refresh ?? false} onChange={(e) => job.setRequest({ ...job.request, refresh: e.target.checked })} /> Refresh evidence</label><button className="button-primary" type="submit"><PlayIcon />Start learning</button>{exampleUsed && <small>Example loaded. Edit it before starting.</small>}</form></div>
}

export const emptyRequest = empty
