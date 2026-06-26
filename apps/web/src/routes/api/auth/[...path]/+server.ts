import type { RequestHandler } from './$types'

import { PRIVATE_API_ORIGIN } from '$env/static/private'
import { forwardResponseCookies, getSharedCookieDomain } from '$lib/domain/auth/cookies.server'

const REQUEST_HEADERS = ['accept', 'content-type', 'cookie', 'origin', 'referer'] as const
const RESPONSE_HEADERS = ['cache-control', 'content-type'] as const

const getProxyHeaders = (request: Request) => {
  const headers = new Headers()

  for (const header of REQUEST_HEADERS) {
    const value = request.headers.get(header)
    if (value) {
      headers.set(header, value)
    }
  }

  return headers
}

const getResponseHeaders = (response: Response) => {
  const headers = new Headers()

  for (const header of RESPONSE_HEADERS) {
    const value = response.headers.get(header)
    if (value) {
      headers.set(header, value)
    }
  }

  return headers
}

const proxy: RequestHandler = async ({ cookies, params, request, url }) => {
  const targetUrl = new URL(`/api/v1/auth/${params.path ?? ''}${url.search}`, PRIVATE_API_ORIGIN)
  const body = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : await request.arrayBuffer()

  const response = await globalThis.fetch(targetUrl, {
    body,
    headers: getProxyHeaders(request),
    method: request.method
  })

  forwardResponseCookies({
    cookies,
    domain: getSharedCookieDomain(url.hostname),
    headers: response.headers
  })

  return new Response(response.body, {
    headers: getResponseHeaders(response),
    status: response.status,
    statusText: response.statusText
  })
}

export const GET = proxy
export const POST = proxy
