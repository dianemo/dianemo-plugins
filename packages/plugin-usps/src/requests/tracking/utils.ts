export const forwardedForHeaders = (forwardedFor: string | undefined) =>
  forwardedFor ? { "X-Forwarded-For": forwardedFor } : undefined;
