import process from 'node:process'

type RuntimeConfig = {
  corsOrigins: string[]
  databaseUrl: string
  nodeEnv: string
  port: number
}
type Env = Record<string, string | undefined>

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

export const loadRuntimeConfig = (env: Env = process.env): RuntimeConfig => {
  const nodeEnv = env.NODE_ENV ?? 'development'
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  return {
    corsOrigins: parseCorsOrigins(nodeEnv, env.PUBLIC_API_CORS_ORIGINS),
    databaseUrl,
    nodeEnv,
    port: Number(env.PORT ?? 3000)
  }
}
