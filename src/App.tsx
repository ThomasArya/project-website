import './index.css';
import type { ReactElement } from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { WatchlistProvider } from './contexts/WatchlistContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { ToastViewport } from './components/ui/ToastViewport.tsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx';
import { AppRoutes } from './routes/index.tsx';

export const App = (): ReactElement => (
  <ErrorBoundary>
    <ToastProvider>
      <AuthProvider>
        <WatchlistProvider>
          <AppRoutes />
          <ToastViewport />
        </WatchlistProvider>
      </AuthProvider>
    </ToastProvider>
  </ErrorBoundary>
);

export default App;