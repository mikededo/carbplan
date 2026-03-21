import { z } from 'zod'

import { ApiSuccessSchema } from '../api'

export const LogInRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
})
export type LogInRequest = z.infer<typeof LogInRequestSchema>

export const SignUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>

const SessionUserSchema = z.object({
  email: z.email().nullable(),
  id: z.uuid()
})
export const SessionSchema = z.object({ user: SessionUserSchema.nullable() })
export type Session = z.infer<typeof SessionSchema>
export const GetSessionResponseSchema = ApiSuccessSchema(SessionSchema)

export const SignOutSchema = z.object({ success: z.literal(true) })
export const SignOutResponseSchema = ApiSuccessSchema(
  SignOutSchema
)
