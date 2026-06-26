import { definePageMetaTags } from 'svelte-meta-tags'

export const load = () =>
  definePageMetaTags({
    description: 'Free cycling calculators and visual tools for gearing, tire pressure, fueling, hydration, and race planning.',
    openGraph: {
      description: 'Free cycling calculators and visual tools for gearing, tire pressure, fueling, hydration, and race planning.',
      title: 'Free Cycling Tools'
    },
    title: 'Free Cycling Tools'
  })
