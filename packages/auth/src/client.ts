import type { BetterAuthClientOptions } from 'better-auth/client'

import { createAuthClient as createBetterAuthClient } from 'better-auth/client'

type Options = { basePath: string } & Omit<BetterAuthClientOptions, 'basePath'>
export const createAuthClient = (options: Options) => createBetterAuthClient(options)

export type AuthClient = ReturnType<typeof createAuthClient>
