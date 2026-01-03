import type { Actions } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import * as v from 'valibot'

import { ROUTES } from '$lib/constants/routes'

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email address')),
  password: v.pipe(v.string(), v.minLength(1, 'Password is required'))
})

export const actions = {
  default: async ({ locals: { supabase }, request }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString()
    const result = v.safeParse(LoginSchema, {
      email: formData.get('email'),
      password: formData.get('password')
    })

    if (!result.success) {
      const errors = v.flatten(result.issues)
      return fail(400, {
        errors: {
          email: errors.nested?.email?.[0],
          password: errors.nested?.password?.[0]
        },
        values: { email }
      })
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: result.output.email,
      password: result.output.password
    })
    if (error) {
      return fail(400, { message: error.message, values: { email } })
    }

    redirect(303, ROUTES.home)
  }
} satisfies Actions

