import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/router';
import { AppProviders } from './app/providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/globals.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/source-serif-4/400.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  </React.StrictMode>,
);
