import { createHash } from 'node:crypto'

export type EndpointHeaderPolicy = {
  cacheControl?: string
  headers?: Record<string, string>
  includeEtag?: boolean
}

type HeaderTarget = {
  headers: Record<string, number | string>
}

type ApplyEndpointHeadersInput = {
  payload: string
  policy: EndpointHeaderPolicy
  request: Request
  set: HeaderTarget
}

export const createEntityTag = (payload: string): string =>
  `"${createHash('sha256').update(payload).digest('base64url')}"`

export const matchesIfNoneMatch = (ifNoneMatch: null | string, etag: string): boolean => {
  if (!ifNoneMatch) {
    return false
  }

  return ifNoneMatch
    .split(',')
    .map((value) => value.trim())
    .some((value) => value === '*' || value === etag)
}

export const applyEndpointHeaders = ({ payload, policy, request, set }: ApplyEndpointHeadersInput): {
  etag: null | string
  notModified: boolean
} => {
  if (policy.cacheControl) {
    set.headers['cache-control'] = policy.cacheControl
  }

  if (policy.headers) {
    for (const [headerName, headerValue] of Object.entries(policy.headers)) {
      set.headers[headerName] = headerValue
    }
  }

  if (policy.includeEtag === false) {
    return {
      etag: null,
      notModified: false
    }
  }

  const etag = createEntityTag(payload)
  set.headers.etag = etag

  return {
    etag,
    notModified: matchesIfNoneMatch(request.headers.get('if-none-match'), etag)
  }
}
