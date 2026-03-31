import * as z from 'zod'

import { createPaginationSuccessSchema } from '../api'

export const LogInRequestSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1)
})
export type LogInRequest = z.infer<typeof LogInRequestSchema>

export const SignUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(8)
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>

const SessionUserSchema = z.object({
  email: z.email().nullable(),
  id: z.uuid()
})
export const SessionSchema = z.object({ user: SessionUserSchema.nullable() })
export type Session = z.infer<typeof SessionSchema>
export const GetSessionResponseSchema = createPaginationSuccessSchema(SessionSchema)

export const SignOutSchema = z.object({ success: z.literal(true) })
export const SignOutResponseSchema = createPaginationSuccessSchema(
  SignOutSchema
)
