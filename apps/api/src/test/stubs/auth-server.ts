import type { AuthServer } from '@carbplan/auth'

import { Elysia } from 'elysia'

type AuthSession = {
  session: Record<string, unknown>
  user: {
    id: string
    isAdmin?: boolean
  }
}

type CreateAuthServerStubOptions = {
  authSession?: AuthSession | null
}

const defaultAuthSession: AuthSession = {
  session: { id: 'session-id' },
  user: { id: '00000000-0000-4000-8000-000000000000' }
}

export const createAuthServerStub = ({
  authSession = defaultAuthSession
}: CreateAuthServerStubOptions = {}): AuthServer => ({
  api: {
    generateOpenAPISchema: async () => ({
      components: {},
      paths: {}
    }),
    getSession: async () => authSession
  },
  handler: new Elysia()
} as unknown as AuthServer)
