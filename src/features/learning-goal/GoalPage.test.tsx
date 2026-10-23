import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
      return {
        request,
        setRequest,
        runGoal,
        status: 'idle',
        error: null,
        models: [
          {
            id: 'gemini-main',
            label: 'Gemini Main',
            provider: 'gemini',
            local: false,
            tier: 'stable',
            available: true,
            used_today: 0,
            limit_today: 20,
            price_in_per_1m: null,
            price_out_per_1m: null,
          },
          {
            id: 'groq-openai/gpt-oss-120b',
            label: 'Groq (openai/gpt-oss-120b)',
            provider: 'groq',
            local: false,
            tier: 'primary',
            available: true,
            used_today: 0,
            limit_today: 1000,
            price_in_per_1m: 0.05,
            price_out_per_1m: 0.08,
          },
          {
            id: 'cerebras-llama3.1-8b',
            label: 'Cerebras (llama3.1-8b)',
            provider: 'cerebras',
            local: false,
            tier: 'fallback',
            available: false,
            used_today: 0,
            limit_today: null,
            price_in_per_1m: 0.1,
            price_out_per_1m: 0.1,
          },
        ],
      };
    },
  };
});

describe('GoalPage', () => {
  it('shows the counter and disables submission over the goal limit', () => {
    render(
      <MemoryRouter>
        <GoalPage />
      </MemoryRouter>,
    );
    const goal = screen.getByPlaceholderText('e.g. understand async state');
    const context = screen.getByPlaceholderText('e.g. a task board with optimistic updates');
    const submit = screen.getByRole('button', { name: /start learning/i });

    fireEvent.change(goal, { target: { value: 'x'.repeat(1001) } });
    fireEvent.change(context, { target: { value: 'Build a task board' } });

    expect(screen.getByText('1001/1000')).toBeInTheDocument();
    expect(screen.getByText('Learning goal must be 1000 characters or fewer.')).toBeInTheDocument();
    expect(submit).toBeDisabled();
  });

  it('renders model options from job.models, disabling unavailable models', () => {
    render(
      <MemoryRouter>
        <GoalPage />
      </MemoryRouter>,
    );
    const select = screen.getByLabelText(/model/i) as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option') as HTMLOptionElement[];
    const optionValues = options.map((opt) => opt.value);
    expect(optionValues).toContain('gemini-main');
    expect(optionValues).toContain('groq-openai/gpt-oss-120b');
    expect(optionValues).toContain('cerebras-llama3.1-8b');

    const cerebrasOption = options.find((opt) => opt.value === 'cerebras-llama3.1-8b');
    expect(cerebrasOption).toBeDisabled();
    expect(cerebrasOption?.textContent).toContain('(unavailable)');

    const groqOption = options.find((opt) => opt.value === 'groq-openai/gpt-oss-120b');
    expect(groqOption).not.toBeDisabled();
  });

  it('submits valid groq-openai/gpt-oss-120b model_id when selected', () => {
    runGoal.mockClear();
    render(
      <MemoryRouter>
        <GoalPage />
      </MemoryRouter>,
    );
    const goal = screen.getByPlaceholderText('e.g. understand async state');
    const context = screen.getByPlaceholderText('e.g. a task board with optimistic updates');
    const modelSelect = screen.getByLabelText(/model/i);
    const submit = screen.getByRole('button', { name: /start learning/i });

    fireEvent.change(goal, { target: { value: 'Learn Groq model integration' } });
    fireEvent.change(context, { target: { value: 'Build a multi-provider test app' } });
    fireEvent.change(modelSelect, { target: { value: 'groq-openai/gpt-oss-120b' } });
    fireEvent.click(submit);

    expect(runGoal).toHaveBeenCalledWith(
      expect.objectContaining({
        model_id: 'groq-openai/gpt-oss-120b',
        goal: 'Learn Groq model integration',
      }),
    );
  });
});
