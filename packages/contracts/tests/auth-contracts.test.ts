import { describe, expect, it } from 'bun:test'

import { ApiErrorSchema } from '../src/api'
import {
  GetSessionResponseSchema,
  LogInRequestSchema,
  SignOutResponseSchema,
  SignUpRequestSchema
} from '../src/domains/auth'

describe('auth contracts', () => {
  it('validates sign-in request', () => {
    const result = LogInRequestSchema.safeParse({
      email: 'athlete@carbplan.app',
      password: 'secret'
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid sign-up request', () => {
    const result = SignUpRequestSchema.safeParse({
      email: 'bad-email',
      password: 'short'
    })

    expect(result.success).toBe(false)
  })

  it('validates get-session response envelope', () => {
    const result = GetSessionResponseSchema.safeParse({
      data: {
        user: {
          email: 'athlete@carbplan.app',
          id: crypto.randomUUID()
        }
      }
    })

    expect(result.success).toBe(true)
  })

  it('validates sign-out success envelope', () => {
    const result = SignOutResponseSchema.safeParse({
      data: {
        success: true
      }
    })

    expect(result.success).toBe(true)
  })

  it('validates shared api error shape', () => {
    const result = ApiErrorSchema.safeParse({
      code: 'AUTH_UNAUTHENTICATED',
      message: 'Not authenticated',
      requestId: crypto.randomUUID()
    })

    expect(result.success).toBe(true)
  })
})
