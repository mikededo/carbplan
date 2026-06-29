import type { Reroute } from '@sveltejs/kit'

import { deLocalizeUrl } from '$lib/domain/i18n/runtime'

export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname
