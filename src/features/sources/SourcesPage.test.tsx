import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LearningResponse } from '../../api/client';
import { SourcesPage } from './SourcesPage';

const result = {
  resources: [],
  evidence_status: 'insufficient',
  evidence_summary: {
    discovered: 4,
    fetched: 1,
    accepted: 0,
    rejected: [{ url: 'https://example.invalid/rejected', reason: 'Retrieval failed.' }],
  },
} as unknown as LearningResponse;

vi.mock('../../app/providers', () => ({
  useJob: () => ({ status: 'ready', result }),
}));

describe('SourcesPage', () => {
  it('shows the empty evidence summary and rejected source details', () => {
    render(
      <MemoryRouter>
        <SourcesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'No reliable sources found' })).toBeInTheDocument();
    expect(screen.getByText(/Evidence status:/)).toBeInTheDocument();
    expect(screen.getByText(/Discovered 4 · fetched 1 · accepted 0/)).toBeInTheDocument();
    expect(screen.getByText('https://example.invalid/rejected')).toBeInTheDocument();
    expect(screen.getByText(/Retrieval failed\./)).toBeInTheDocument();
  });
});
