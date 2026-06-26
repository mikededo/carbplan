import { createAuthClient } from '@kilo/auth/client'

export const authClient = createAuthClient({ basePath: '/api/auth' })
