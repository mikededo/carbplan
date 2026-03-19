import { loadAuthConfig } from '@carbplan/auth'

type RuntimeConfig = {
  authBaseUrl: string
  authSecret: string
  authTrustedOrigins: string[]
  corsOrigins: string[]
  databaseUrl: string
  nodeEnv: string
  port: number
}

const LOCAL_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173'
]

const parseCorsOrigins = (nodeEnv: string, envValue?: string): string[] => {
  const configuredOrigins = (envValue ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)

  if (nodeEnv === 'production' && configuredOrigins.length === 0) {
    throw new Error('PUBLIC_API_CORS_ORIGINS is required in production')
  }

  const defaults = nodeEnv === 'production' ? [] : LOCAL_CORS_ORIGINS
  return [...new Set([...configuredOrigins, ...defaults])]
}

export const loadRuntimeConfig = (env: CarbplanApiEnv = Bun.env): RuntimeConfig => {
  const nodeEnv = env.ENVIRONMENT ?? 'development'
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const port = Number(env.PORT ?? 3000)
  const corsOrigins = parseCorsOrigins(nodeEnv, env.PUBLIC_API_CORS_ORIGINS)
  const authConfig = loadAuthConfig({
    authBaseUrl: env.AUTH_BASE_URL,
    authSecret: env.BETTER_AUTH_SECRET,
    authTrustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS,
    fallbackBaseUrl: `http://localhost:${port}`,
    fallbackTrustedOrigins: corsOrigins
  })

  return {
    authBaseUrl: authConfig.baseURL,
    authSecret: authConfig.secret,
    authTrustedOrigins: authConfig.trustedOrigins,
    corsOrigins,
    databaseUrl,
    nodeEnv,
    port
  }
}
