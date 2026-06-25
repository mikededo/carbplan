import type { RequestHandler } from './$types'

import { PRIVATE_API_ORIGIN } from '$env/static/private'

const proxy: RequestHandler = async ({ params, request, url }) => {
  const targetUrl = new URL(`/api/auth/${params.path ?? ''}${url.search}`, PRIVATE_API_ORIGIN)
  const body = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : await request.arrayBuffer()

  const response = await globalThis.fetch(targetUrl, {
    body,
    headers: request.headers,
    method: request.method
  })

  return new Response(response.body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText
  })
}

export const GET = proxy
export const POST = proxy
