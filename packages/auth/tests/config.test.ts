import { describe, expect, it } from 'vitest'

import { loadAuthConfig, mergeTrustedOrigins } from '../src/config'

describe('auth config', () => {
  it('requires BETTER_AUTH_SECRET', () => {
    expect(() => loadAuthConfig({
      authBaseUrl: 'http://localhost:3000'
    })).toThrow('BETTER_AUTH_SECRET is required')
  })

  it('requires base URL through AUTH_BASE_URL or fallback', () => {
    expect(() => loadAuthConfig({
      authSecret: 'secret'
    })).toThrow('AUTH_BASE_URL is required')
  })

  it('merges and normalizes trusted origins', () => {
    const config = loadAuthConfig({
      authBaseUrl: 'http://localhost:3000/',
      authSecret: 'secret',
      authTrustedOrigins: 'http://localhost:5173, http://localhost:3000/',
      fallbackTrustedOrigins: ['http://localhost:4173']
    })

    expect(config.baseURL).toBe('http://localhost:3000')
    expect(config.trustedOrigins).toEqual([
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173'
    ])
  })

  it('deduplicates origins', () => {
    const merged = mergeTrustedOrigins(
      ['http://localhost:3000'],
      ['http://localhost:3000/']
    )

    expect(merged).toEqual(['http://localhost:3000'])
  })
})
