import type { Cookies } from '@sveltejs/kit'

import * as z from 'zod'

const SameSiteSchema = z.enum(['lax', 'none', 'strict'])

const getSetCookieHeaders = (headers: Headers): string[] => {
  if ('getSetCookie' in headers && typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie()
  }

  const setCookie = headers.get('set-cookie')
  return setCookie ? [setCookie] : []
}

const toBoolean = (value: string | undefined) => value === undefined

const parseExpires = (value: string | undefined) => {
  if (!value) {
    return undefined
  }

  const expires = new Date(value)
  return Number.isNaN(expires.getTime()) ? undefined : expires
}

const parseSameSite = (value: string | undefined): undefined | z.infer<typeof SameSiteSchema> => {
  const result = SameSiteSchema.safeParse(value?.toLowerCase())
  return result.success ? result.data : undefined
}

const parseSetCookie = (value: string) => {
  const [nameValue, ...attributes] = value.split(';')
  const [name, ...valueParts] = nameValue.split('=')
  const parsedValue = valueParts.join('=').trim()

  const cookie = {
    name: name.trim(),
    options: {
      expires: undefined as Date | undefined,
      httpOnly: false,
      maxAge: undefined as number | undefined,
      path: '/',
      sameSite: undefined as 'lax' | 'none' | 'strict' | undefined,
      secure: false
    },
    value: parsedValue
  }

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.trim().split('=')
    const key = rawKey.toLowerCase()
    const attributeValue = rawValueParts.join('=').trim() || undefined

    if (key === 'expires') {
      cookie.options.expires = parseExpires(attributeValue)
      continue
    }

    if (key === 'httponly') {
      cookie.options.httpOnly = toBoolean(attributeValue)
      continue
    }

    if (key === 'max-age') {
      const maxAge = Number(attributeValue)
      cookie.options.maxAge = Number.isNaN(maxAge) ? undefined : maxAge
      continue
    }

    if (key === 'path' && attributeValue) {
      cookie.options.path = attributeValue
      continue
    }

    if (key === 'samesite') {
      cookie.options.sameSite = parseSameSite(attributeValue)
      continue
    }

    if (key === 'secure') {
      cookie.options.secure = toBoolean(attributeValue)
    }
  }

  return cookie
}

type ForwardResponseCookiesParams = { cookies: Cookies, headers: Headers }
export const forwardResponseCookies = ({ cookies, headers }: ForwardResponseCookiesParams) => {
  for (const setCookieHeader of getSetCookieHeaders(headers)) {
    const cookie = parseSetCookie(setCookieHeader)
    if (!cookie.name) {
      continue
    }

    cookies.set(cookie.name, cookie.value, cookie.options)
  }
}
