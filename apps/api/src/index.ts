import { createAppFromEnv } from '$bootstrap/app'

export { createApp } from '$bootstrap/app'
export type { AppServices, PublicServices } from '$bootstrap/services'

if (import.meta.main) {
  const { app, runtimeConfig } = createAppFromEnv()
  const server = app.listen(runtimeConfig.port)

  console.warn(`API listening at http://${server.server?.hostname}:${server.server?.port}`)
}
