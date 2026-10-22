import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

type State = { error: Error | null };

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('DEVSCOUT UI error', error, info);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <main className="panel state-panel error-state">
        <h1>Something went wrong</h1>
        <p>{this.state.error.message}</p>
        <button className="button-secondary" onClick={() => window.location.reload()}>
          Reload app
        </button>
      </main>
    );
  }
}
