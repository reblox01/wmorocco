import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Guard for SDKs without captureRequestError
export const onRequestError = (error: unknown) => {
  const anySentry = Sentry as any;
  if (typeof anySentry.captureRequestError === 'function') {
    return anySentry.captureRequestError(error);
  }
  return anySentry.captureException?.(error);
};
