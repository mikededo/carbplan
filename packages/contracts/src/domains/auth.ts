import { z } from 'zod'

import { ApiSuccessSchema } from '$lib/api'

export const SignInRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
})

export const SignUpRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export const SessionUserSchema = z.object({
  email: z.email().nullable(),
  id: z.uuid()
})

export const SessionSchema = z.object({ user: SessionUserSchema.nullable() })

export const GetSessionResponseSchema = ApiSuccessSchema(SessionSchema)
export const SignOutResponseSchema = ApiSuccessSchema(
  z.object({ success: z.literal(true) })
)

export type Session = z.infer<typeof SessionSchema>
export type SignInRequest = z.infer<typeof SignInRequestSchema>
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
