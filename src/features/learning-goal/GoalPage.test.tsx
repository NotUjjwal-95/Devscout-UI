import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LearnRequest } from '../../api/client';
import { GoalPage } from './GoalPage';

const runGoal = vi.fn();

vi.mock('../../app/providers', async () => {
  const React = await import('react');
  const initialRequest: LearnRequest = {
    goal: '',
    description: '',
    experience_level: 'beginner',
    tech_stack: [],
    wants_snippet: true,
    refresh: false,
  };
  return {
    useJob: () => {
      const [request, setRequest] = React.useState(initialRequest);
      return { request, setRequest, runGoal, status: 'idle', error: null };
    },
  };
});

describe('GoalPage', () => {
  it('shows the counter and disables submission over the goal limit', () => {
    render(<GoalPage />);
    const goal = screen.getByPlaceholderText('e.g. understand async state');
    const context = screen.getByPlaceholderText('e.g. a task board with optimistic updates');
    const submit = screen.getByRole('button', { name: /start learning/i });

    fireEvent.change(goal, { target: { value: 'x'.repeat(1001) } });
    fireEvent.change(context, { target: { value: 'Build a task board' } });

    expect(screen.getByText('1001/1000')).toBeInTheDocument();
    expect(screen.getByText('Learning goal must be 1000 characters or fewer.')).toBeInTheDocument();
    expect(submit).toBeDisabled();
  });
});
