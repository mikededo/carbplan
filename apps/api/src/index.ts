import { createAppFromEnv } from '$bootstrap/app'

export { createApp } from '$bootstrap/app'
export type { AppServices, PublicServices } from '$bootstrap/services'

if (import.meta.main) {
  createAppFromEnv().then(({ app, runtimeConfig }) => {
    app.listen(runtimeConfig.port)
  })
}
