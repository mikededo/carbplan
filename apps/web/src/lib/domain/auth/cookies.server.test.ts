import { describe, expect, it } from 'vitest'

import { getSharedCookieDomain } from './cookies.server'

describe('getSharedCookieDomain', () => {
  it('returns parent domain for subdomains', () => {
    expect(getSharedCookieDomain('app.kilo.localhost')).toBe('kilo.localhost')
    expect(getSharedCookieDomain('api.kilo.localhost')).toBe('kilo.localhost')
  })

  it('keeps single-host development origins host-only', () => {
    expect(getSharedCookieDomain('localhost')).toBeUndefined()
    expect(getSharedCookieDomain('127.0.0.1')).toBeUndefined()
  })

  it('keeps apex domains host-only', () => {
    expect(getSharedCookieDomain('kilo.localhost')).toBeUndefined()
    expect(getSharedCookieDomain('kilo.app')).toBeUndefined()
  })
})
