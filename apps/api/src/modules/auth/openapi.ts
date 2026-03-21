import type { AuthServer } from '@carbplan/auth'

const AUTH_PREFIX = '/api/v1/auth'

export const OpenAPI = {
  components: (auth: AuthServer) => {
    let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
    const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

    return getSchema().then(({ components }) => components) as Promise<any>
  },
  getPaths: (auth: AuthServer) => {
    let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
    const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

    return getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null)

      for (const path of Object.keys(paths)) {
        const key = `${AUTH_PREFIX}${path}`
        reference[key] = paths[path]

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method]

          operation.tags = ['Auth']
        }
      }

      return reference
    }) as Promise<any>
  }
} as const
