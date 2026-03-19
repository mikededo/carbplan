declare global {
  type CarbplanApiEnv = {
    AUTH_BASE_URL: string
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_TRUSTED_ORIGINS: string
    DATABASE_URL: string
    ENVIRONMENT?: 'development' | 'production'
    PORT?: number

    PUBLIC_API_CORS_ORIGINS?: string
  }
}

declare module 'bun' {
  interface Env extends CarbplanApiEnv {}
}

export {}
