import { describe, expect, it } from 'vitest'
import * as z from 'zod'

import { createTransport } from './transport'

describe('createTransport', () => {
  it('parses JSON responses before validating schemas', async () => {
    const transport = createTransport({
      fetch: async () => new Response(JSON.stringify({ token: 'auth-token' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    })

    const result = await transport.post({
      body: { email: 'athlete@carbplan.app', password: 'password' },
      path: '/auth/sign-in/email',
      schema: z.object({ token: z.string().trim() })
    })

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ token: 'auth-token' })
  })

  it('parses JSON error responses', async () => {
    const transport = createTransport({
      fetch: async () => new Response(JSON.stringify({
        code: 'AUTH_UNAUTHENTICATED',
        message: 'Invalid email or password',
        requestId: 'request-id'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401
      })
    })

    const result = await transport.post({
      body: { email: 'athlete@carbplan.app', password: 'bad-password' },
      path: '/auth/sign-in/email',
      schema: z.object({ token: z.string().trim() })
    })

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toMatchObject({
      code: 'AUTH_UNAUTHENTICATED',
      message: 'Invalid email or password',
      requestId: 'request-id',
      status: 401
    })
  })
})
