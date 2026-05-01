import type { RequestHandler } from './$types'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { AUTH_SESSION_COOKIE_NAME, AUTH_TOKEN_COOKIE_NAME } from '$lib/domain/auth/constants'

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
])

type GetProxyHeadersParams = {
  sessionToken?: string
  authToken?: string
  request: Request
}
const getProxyHeaders = ({ authToken, request, sessionToken }: GetProxyHeadersParams) => {
  const headers = new Headers(request.headers)

  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header)
  }

  headers.delete('cookie')

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  if (sessionToken) {
    headers.set('Cookie', `${AUTH_SESSION_COOKIE_NAME}=${sessionToken}`)
  }

  return headers
}

const proxy: RequestHandler = async ({ cookies, params, request, url }) => {
  const targetUrl = new URL(`/api/v1/${params.path ?? ''}${url.search}`, PRIVATE_API_ORIGIN)
  const body = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : await request.arrayBuffer()
  const authToken = cookies.get(AUTH_TOKEN_COOKIE_NAME)
  const sessionToken = cookies.get(AUTH_SESSION_COOKIE_NAME)

  const response = await globalThis.fetch(targetUrl, {
    body,
    headers: getProxyHeaders({ authToken, request, sessionToken }),
    method: request.method
  })

  return new Response(response.body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText
  })
}

export const DELETE = proxy
export const GET = proxy
export const PATCH = proxy
export const POST = proxy
export const PUT = proxy
