import { describe, expect, it } from 'vitest'

import { getSharedCookieDomain } from './cookies.server'

describe('getSharedCookieDomain', () => {
  it('returns parent domain for subdomains', () => {
    expect(getSharedCookieDomain('app.carbplan.localhost')).toBe('carbplan.localhost')
    expect(getSharedCookieDomain('api.carbplan.localhost')).toBe('carbplan.localhost')
  })

  it('keeps single-host development origins host-only', () => {
    expect(getSharedCookieDomain('localhost')).toBeUndefined()
    expect(getSharedCookieDomain('127.0.0.1')).toBeUndefined()
  })

  it('keeps apex domains host-only', () => {
    expect(getSharedCookieDomain('carbplan.localhost')).toBeUndefined()
    expect(getSharedCookieDomain('carbplan.app')).toBeUndefined()
  })
})
