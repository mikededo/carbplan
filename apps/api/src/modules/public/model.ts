import { t } from 'elysia'

export const ApiErrorModel = t.Object({
  code: t.String(),
  message: t.String(),
  requestId: t.Optional(t.String())
})

export type ApiError = typeof ApiErrorModel.static
