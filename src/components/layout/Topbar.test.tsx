import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LearningResponse } from '../../api/client';
import { Topbar } from './Topbar';

const result = {
  metrics: [],
  models_used: ['gemini-test'],
  from_cache: true,
  generated_at: '2026-10-21T08:00:00Z',
} as unknown as LearningResponse;

vi.mock('../../app/providers', () => ({
  useJob: () => ({
    result,
    quota: null,
    resetGoal: vi.fn(),
  }),
}));

describe('Topbar', () => {
  it('shows cached result metadata and models', () => {
    render(
      <MemoryRouter>
        <Topbar open={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Models gemini-test')).toBeInTheDocument();
    expect(screen.getByText(/Cached/)).toBeInTheDocument();
  });
});
