import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LearningResponse } from '../../api/client';
import { ExplanationPage } from './ExplanationPage';

const result = {
  resources: [
    {
      resource_id: 'r1',
      url: 'https://example.com/docs',
      title: 'Example docs',
    },
  ],
  explanation: {
    topic: 'Caching',
    summary: 'A short explanation.',
    sections: [
      {
        title: 'Supported section',
        content: 'Supported content.',
        support_status: 'supported',
        citations: [{ resource_id: 'r1', supporting_quote: 'This is the supporting quote.' }],
      },
      {
        title: 'Weak section',
        content: 'Weak content.',
        support_status: 'weakly_supported',
        citations: [],
      },
      {
        title: 'Unsupported section',
        content: 'Unsupported content.',
        support_status: 'unsupported',
        citations: [],
      },
    ],
  },
} as unknown as LearningResponse;

vi.mock('../../app/providers', () => ({
  useJob: () => ({ status: 'ready', result }),
}));

describe('ExplanationPage', () => {
  it('renders support badges and expands a citation quote', () => {
    render(
      <MemoryRouter>
        <ExplanationPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('supported')).toBeInTheDocument();
    expect(screen.getByText('weakly supported')).toBeInTheDocument();
    expect(screen.getByText('Not backed by sources')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Example docs' })).toHaveAttribute('href', 'https://example.com/docs');

    fireEvent.click(screen.getByRole('button', { name: 'Show quote' }));
    expect(screen.getByText('“This is the supporting quote.”')).toBeInTheDocument();
  });
});
