export const getErrorMessageOrDefault = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback
