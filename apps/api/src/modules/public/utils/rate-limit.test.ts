import { describe, expect, it } from 'bun:test'

import { createEndpointRateLimiter, resolveRateLimitClientKey } from './rate-limit'

describe('rate-limit util', () => {
  it('isolates limit buckets by endpoint key', () => {
    const limiter = createEndpointRateLimiter()
    const policy = {
      maxRequests: 1,
      windowMs: 1_000
    }

    const firstCatalog = limiter.consume({
      clientKey: '1.2.3.4',
      endpointKey: 'catalog',
      now: 0,
      policy
    })
    const secondCatalog = limiter.consume({
      clientKey: '1.2.3.4',
      endpointKey: 'catalog',
      now: 0,
      policy
    })
    const firstHealth = limiter.consume({
      clientKey: '1.2.3.4',
      endpointKey: 'health',
      now: 0,
      policy
    })

    expect(firstCatalog).toBe(true)
    expect(secondCatalog).toBe(false)
    expect(firstHealth).toBe(true)
  })

  it('resets bucket after the configured window', () => {
    const limiter = createEndpointRateLimiter()
    const policy = {
      maxRequests: 1,
      windowMs: 100
    }

    const first = limiter.consume({
      clientKey: '5.6.7.8',
      endpointKey: 'catalog',
      now: 0,
      policy
    })
    const blocked = limiter.consume({
      clientKey: '5.6.7.8',
      endpointKey: 'catalog',
      now: 50,
      policy
    })
    const reset = limiter.consume({
      clientKey: '5.6.7.8',
      endpointKey: 'catalog',
      now: 101,
      policy
    })

    expect(first).toBe(true)
    expect(blocked).toBe(false)
    expect(reset).toBe(true)
  })

  it('resolves client key using forwarded header first, then server fallback', () => {
    const requestWithForwarded = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '9.9.9.9, 10.0.0.1'
      }
    })

    const forwarded = resolveRateLimitClientKey(requestWithForwarded, {
      requestIP: () => ({
        address: '127.0.0.1'
      })
    })

    const serverOnly = resolveRateLimitClientKey(new Request('http://localhost'), {
      requestIP: () => ({
        address: '127.0.0.1'
      })
    })

    const unknown = resolveRateLimitClientKey(new Request('http://localhost'), null)

    expect(forwarded).toBe('9.9.9.9')
    expect(serverOnly).toBe('127.0.0.1')
    expect(unknown).toBe('unknown')
  })
})
