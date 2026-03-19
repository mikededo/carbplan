export type EndpointKey = string

export type EndpointRateLimitPolicy = {
  maxRequests: number
  windowMs: number
}

type RateLimitBucket = {
  count: number
  resetAt: number
}

type ConsumeRateLimitInput = {
  clientKey: string
  endpointKey: EndpointKey
  now?: number
  policy: EndpointRateLimitPolicy
}

type RequestIpServer = {
  requestIP: (request: Request) => {
    address: string
  } | null
}

export type EndpointRateLimiter = {
  consume: (input: ConsumeRateLimitInput) => boolean
}

const ensureValidPolicy = ({ maxRequests, windowMs }: EndpointRateLimitPolicy): void => {
  if (maxRequests < 1) {
    throw new RangeError('maxRequests must be at least 1')
  }

  if (windowMs < 1) {
    throw new RangeError('windowMs must be at least 1')
  }
}

export const resolveRateLimitClientKey = (request: Request, server: null | RequestIpServer | undefined): string => {
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (forwardedIp) {
    return forwardedIp
  }

  const serverIp = server?.requestIP(request)?.address
  return serverIp ?? 'unknown'
}

export const createEndpointRateLimiter = (): EndpointRateLimiter => {
  const bucketsByEndpoint = new Map<EndpointKey, Map<string, RateLimitBucket>>()

  return {
    consume: ({ clientKey, endpointKey, now = Date.now(), policy }: ConsumeRateLimitInput): boolean => {
      ensureValidPolicy(policy)

      const endpointBuckets = bucketsByEndpoint.get(endpointKey) ?? new Map<string, RateLimitBucket>()
      if (!bucketsByEndpoint.has(endpointKey)) {
        bucketsByEndpoint.set(endpointKey, endpointBuckets)
      }

      const bucket = endpointBuckets.get(clientKey)
      if (!bucket || now > bucket.resetAt) {
        endpointBuckets.set(clientKey, {
          count: 1,
          resetAt: now + policy.windowMs
        })
        return true
      }

      if (bucket.count >= policy.maxRequests) {
        return false
      }

      bucket.count += 1
      return true
    }
  }
}
