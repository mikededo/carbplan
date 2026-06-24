import type { createApiRoutes } from './bootstrap/routes'

export type ApiRoutes = Awaited<ReturnType<typeof createApiRoutes>>
