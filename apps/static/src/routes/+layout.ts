import { defineBaseMetaTags } from 'svelte-meta-tags'

import { env } from '$env/dynamic/public'

export const prerender = true

export const load = ({ url }) => {
  const canonical = new URL(url.pathname, env.PUBLIC_SITE_ORIGIN || 'https://kilo.app').href

  return defineBaseMetaTags({
    canonical,
    description: 'Plan your nutrition for every workout with custom fueling strategies based on duration, power, and personal tolerance.',
    openGraph: {
      description: 'Plan your nutrition for every workout with custom fueling strategies based on duration, power, and personal tolerance.',
      siteName: 'Kilo',
      title: 'Kilo',
      type: 'website',
      url: canonical
    },
    title: 'Kilo',
    titleTemplate: '%s | Kilo',
    twitter: {
      cardType: 'summary_large_image'
    }
  })
}
