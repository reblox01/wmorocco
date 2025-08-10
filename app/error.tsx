'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import EmptyState from './components/EmptyState';

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return <EmptyState title="Uh Oh" subtitle="Something went wrong!" />;
};

export default ErrorState;
