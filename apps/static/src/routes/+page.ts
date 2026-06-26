import { definePageMetaTags } from 'svelte-meta-tags'

export const load = () =>
  definePageMetaTags({
    description: 'Plan your nutrition for every workout. Build custom fueling strategies based on your power, duration, and personal tolerance.',
    openGraph: {
      description: 'Plan your nutrition for every workout. Build custom fueling strategies based on your power, duration, and personal tolerance.',
      title: 'Athlete Nutrition Planning'
    },
    title: 'Athlete Nutrition Planning'
  })
