import { applyEndpointHeaders, createEntityTag, matchesIfNoneMatch } from './headers'

const cachePolicy = {
  cacheControl: 'public, max-age=60',
  headers: {
    'x-endpoint': 'catalog'
  }
}

describe('headers util', () => {
  it('creates deterministic ETags for the same payload', () => {
    const payload = '{"value":1}'

    expect(createEntityTag(payload)).toBe(createEntityTag(payload))
  })

  it('matches If-None-Match using exact, wildcard, and comma-separated values', () => {
    const etag = '"abc123"'

    expect(matchesIfNoneMatch(etag, etag)).toBe(true)
    expect(matchesIfNoneMatch('*', etag)).toBe(true)
    expect(matchesIfNoneMatch('"other", "abc123"', etag)).toBe(true)
    expect(matchesIfNoneMatch('"other"', etag)).toBe(false)
  })

  it('applies policy headers and computes ETag', () => {
    const set = {
      headers: {} as Record<string, number | string>
    }

    const result = applyEndpointHeaders({
      payload: '{"items":[]}',
      policy: cachePolicy,
      request: new Request('http://localhost'),
      set
    })

    expect(set.headers['cache-control']).toBe('public, max-age=60')
    expect(set.headers['x-endpoint']).toBe('catalog')
    expect(result.etag).not.toBeNull()
    expect(set.headers.etag).toBe(result.etag!)
    expect(result.notModified).toBe(false)
  })

  it('returns notModified when If-None-Match matches computed ETag', () => {
    const payload = '{"items":[1]}'
    const etag = createEntityTag(payload)
    const set = {
      headers: {} as Record<string, number | string>
    }

    const result = applyEndpointHeaders({
      payload,
      policy: cachePolicy,
      request: new Request('http://localhost', {
        headers: {
          'if-none-match': etag
        }
      }),
      set
    })

    expect(result.notModified).toBe(true)
    expect(result.etag).toBe(etag)
  })
})
