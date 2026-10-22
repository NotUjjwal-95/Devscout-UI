import { render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function BrokenComponent(): JSX.Element {
  throw new Error('test render failure');
}

describe('ErrorBoundary', () => {
  it('shows a recovery view when a child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('test render failure')).toBeInTheDocument();
  });
});
