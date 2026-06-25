import { createAuthClient } from '@carbplan/auth/client'

export const authClient = createAuthClient({ basePath: '/api/auth' })
