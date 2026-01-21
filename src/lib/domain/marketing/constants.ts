import type { Icon } from '@lucide/svelte'

import type { ButtonVariant } from '$lib/domain/ui/button'

import {
  ActivityIcon,
  ChartColumnIcon,
  ChevronRightIcon,
  PillIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon
} from '@lucide/svelte'

export type Feature = {
  title: string
  description: string
  icon: typeof Icon
}

export const FEATURES: Feature[] = [
  {
    description: 'Auto-calculate nutrition needs based on workout duration, intensity, and your FTP.',
    icon: TargetIcon,
    title: 'Smart Planning'
  },
  {
    description: 'Customize carb intake for each power and heart rate zone.',
    icon: ChartColumnIcon,
    title: 'Zone-Based Fueling'
  },
  {
    description: 'Access 250+ products with full nutrition data from top brands.',
    icon: PillIcon,
    title: 'Supplement Database'
  },
  {
    description: 'Progressive plans to increase your carb absorption capacity over time.',
    icon: ActivityIcon,
    title: 'Gut Training'
  },
  {
    description: 'Monitor TSS, kJ, and nutrition compliance across all your workouts.',
    icon: TrendingUpIcon,
    title: 'Performance Tracking'
  },
  {
    description: 'Generate nutrition strategies in seconds with our AI-powered engine.',
    icon: ZapIcon,
    title: 'Quick Plans'
  }
]

export type Stat = {
  label: string
  suffix: string
  value: number
}

export const STATS: Stat[] = [
  { label: 'Supplements', suffix: '+', value: 250 },
  { label: 'Brands', suffix: '+', value: 20 },
  { label: 'Power Zones', suffix: '', value: 6 },
  { label: 'Macros Tracked', suffix: '', value: 5 }
]

export type PricingTier = {
  cta: string
  ctaVariant: ButtonVariant
  features: string[]
  name: string
  price: string
  description: string
  popular?: boolean
  priceNote?: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    cta: 'Get Started',
    ctaVariant: 'secondary',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 nutrition plans',
      'Unlimited custom products',
      'Full supplement database',
      'Power & HR zone configuration',
      'Basic analytics',
      'Coach up to 3 athletes'
    ],
    name: 'Free',
    price: '€0'
  },
  {
    cta: 'Start Free Trial',
    ctaVariant: 'default',
    description: 'For dedicated athletes',
    features: [
      'Unlimited nutrition plans',
      'Unlimited custom products',
      'Full supplement database',
      'Advanced zone configuration',
      'Detailed performance analytics',
      'Historical data & trends',
      'Export plans to PDF',
      'Priority support'
    ],
    name: 'Premium',
    popular: true,
    price: '€5'
  },
  {
    cta: 'Start coaching',
    ctaVariant: 'secondary',
    description: 'For coaches & teams',
    features: [
      'Everything in Premium',
      'Unlimited athletes',
      'Team management dashboard',
      'Shared supplement library',
      'Athlete plan templates',
      'Bulk plan creation',
      'Team analytics & reporting',
      'Direct founder support'
    ],
    name: 'Coach',
    price: '€15',
    priceNote: '+ €5/athlete (first 10) or €2.50/athlete (11+)'
  }
]

export type HeroFeature = {
  label: string
  description: string
  icon: typeof Icon
}

export const HERO_FEATURES: HeroFeature[] = [
  { description: 'Detailed nutrition schedules', icon: ChevronRightIcon, label: 'Pre-Ride Planning' },
  { description: 'FTP & HR zone targeting', icon: ChevronRightIcon, label: 'Zone-Based Calculations' },
  { description: 'Track & refine over time', icon: ChevronRightIcon, label: 'Historical Analysis' },
  { description: 'Progressive adaptation', icon: ChevronRightIcon, label: 'Gut Training Protocols' }
]

export type ProductShowcaseData = {
  badge: string
  bullets: string[]
  ctaHref: string
  ctaText: string
  title: string
  description: string
}

export const PRODUCT_SHOWCASES: Record<'dashboard' | 'planner' | 'supplements', ProductShowcaseData> = {
  dashboard: {
    badge: 'Dashboard',
    bullets: [
      'Weekly TSS and kJ summaries',
      'Nutrition plan completion rates',
      'Performance trend analysis',
      'Quick-access to recent plans'
    ],
    ctaHref: '/dashboard',
    ctaText: 'Explore Dashboard',
    description:
      'Get a complete overview of your weekly training stress, energy expenditure, and nutrition compliance. Spot trends and optimize your fueling strategy over time.',
    title: 'Track your training load and nutrition in one place'
  },
  planner: {
    badge: 'Plan Builder',
    bullets: [
      'Auto-calculate kJ from power data',
      'Set carb targets based on gut tolerance',
      'Mix and match supplements',
      'Post-ride recovery planning'
    ],
    ctaHref: '/dashboard',
    ctaText: 'Create Your First Plan',
    description:
      'Input your workout details and let CarbPlan calculate exact carb and calorie needs. Select from your favorite supplements and hit your targets every time.',
    title: 'Build nutrition plans that match your workout'
  },
  supplements: {
    badge: 'Supplement Database',
    bullets: [
      '250+ products from 20+ brands',
      'Complete nutrition data',
      'Filter by type, brand, or macros',
      'Add custom products'
    ],
    ctaHref: '/supplements',
    ctaText: 'Browse Supplements',
    description:
      'Access a comprehensive database of sports nutrition products from top brands. Compare products, track favorites, and add your own custom supplements.',
    title: 'Every product, every macro, at your fingertips'
  }
}

export const FOOTER_LINKS = {
  legal: [
    { href: '#', label: 'Privacy' },
    { href: '#', label: 'Terms' }
  ],
  product: [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' }
  ]
}
