import type { Handle } from '@sveltejs/kit'

import { getTextDirection } from '$lib/domain/i18n/runtime'
import { paraglideMiddleware } from '$lib/domain/i18n/server'

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ locale, request }) => {
  event.request = request

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
  })
})

export const handle: Handle = handleParaglide
