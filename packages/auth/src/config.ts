export type AuthConfig = {
  baseURL: string
  secret: string
  trustedOrigins: string[]
}

export type LoadAuthConfigOptions = {
  authBaseUrl?: string
  authSecret?: string
  authTrustedOrigins?: string
  fallbackBaseUrl?: string
  fallbackTrustedOrigins?: string[]
}

const normalizeURL = (raw: string) => {
  const url = new URL(raw)
  return url.toString().replace(/\/$/, '')
}

const parseOrigins = (value?: string) => (value ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0)

export const mergeTrustedOrigins = (...origins: (readonly string[] | undefined)[]) => [...new Set(origins
  .flatMap((originList) => originList ?? [])
  .map((origin) => normalizeURL(origin)))]

export const loadAuthConfig = ({
  authBaseUrl,
  authSecret,
  authTrustedOrigins,
  fallbackBaseUrl,
  fallbackTrustedOrigins
}: LoadAuthConfigOptions): AuthConfig => {
  const resolvedSecret = authSecret?.trim()
  if (!resolvedSecret) {
    throw new Error('BETTER_AUTH_SECRET is required')
  }

  const resolvedBaseURL = authBaseUrl?.trim() || fallbackBaseUrl?.trim()
  if (!resolvedBaseURL) {
    throw new Error('AUTH_BASE_URL is required')
  }

  const trustedOrigins = mergeTrustedOrigins(
    parseOrigins(authTrustedOrigins),
    fallbackTrustedOrigins,
    [resolvedBaseURL]
  )

  return {
    baseURL: normalizeURL(resolvedBaseURL),
    secret: resolvedSecret,
    trustedOrigins
  }
}
