import { Elysia } from 'elysia'

import { authModule } from '$modules/auth'
import { createAuthServerStub } from '$test/stubs/auth-server'

const createApp = (options?: Parameters<typeof createAuthServerStub>[0]) => new Elysia()
  .use(authModule({ auth: createAuthServerStub(options) }))
  .guard({ admin: true })
  .get('/protected-admin', () => ({ ok: true }))

const createProtectedAdminRequest = () => new Request('http://localhost/protected-admin')

describe('auth module macros', () => {
  it('returns 401 for unauthenticated admin requests', async () => {
    const app = createApp({ authSession: null })
    const response = await app.handle(createProtectedAdminRequest())
    expect(response.status).toBe(401)
  })

  it('returns 403 for authenticated non-admin admin requests', async () => {
    const app = createApp({
      authSession: {
        session: { id: 'session-id' },
        user: { id: 'athlete-id', isAdmin: false }
      }
    })
    const response = await app.handle(createProtectedAdminRequest())
    expect(response.status).toBe(403)
  })

  it('allows authenticated admin requests', async () => {
    const app = createApp({
      authSession: {
        session: { id: 'session-id' },
        user: { id: 'athlete-id', isAdmin: true }
      }
    })
    const response = await app.handle(createProtectedAdminRequest())
    expect(response.status).toBe(200)
  })
})
