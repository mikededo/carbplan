import * as z from 'zod'

const SessionSchema = z.object({
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  id: z.uuid(),
  ipAddress: z.string().trim(),
  token: z.string().trim(),
  updatedAt: z.coerce.date(),
  userAgent: z.string().trim(),
  userId: z.uuid()
})
export type Session = z.infer<typeof SessionSchema>

const UserSchema = z.object({
  createdAt: z.coerce.date(),
  email: z.email(),
  emailVerified: z.boolean(),
  id: z.uuid(),
  image: z.string().trim().nullable(),
  /** Only present in get-session, not in sign-in response */
  isAdmin: z.boolean().optional(),
  name: z.string().trim(),
  updatedAt: z.coerce.date()
})
export type User = z.infer<typeof UserSchema>

export const SignInRequestSchema = z.object({
  email: z.email(),
  // TODO: Improve
  password: z.string().trim().min(1)
})
export type SignInRequest = z.infer<typeof SignInRequestSchema>
export const SignInResponseSchema = z.object({
  redirect: z.boolean().optional(),
  token: z.string().trim(),
  user: UserSchema
})
export type SignInResponse = z.infer<typeof SignInResponseSchema>

export const SignUpRequestSchema = z.object({
  email: z.email(),
  name: z.string().trim(),
  password: z.string().trim().min(8)
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
export const SignUpResponseSchema = z.object({
  token: z.string().trim(),
  user: UserSchema
})

export const GetSessionResponseSchema = z.object({
  session: SessionSchema,
  user: UserSchema
})
export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>

export const SignOutResponseSchema = z.object({ success: z.literal(true) })
export type SignOutResponse = z.infer<typeof SignOutResponseSchema>
