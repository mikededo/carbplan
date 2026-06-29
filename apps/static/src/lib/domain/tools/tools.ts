import type { Icon } from '@lucide/svelte'

import {
  CandyIcon,
  ChartNoAxesCombinedIcon,
  ClipboardCheckIcon,
  CoffeeIcon,
  CogIcon,
  DropletsIcon,
  FlagIcon,
  FlaskConicalIcon,
  GaugeIcon,
  MountainIcon,
  ScaleIcon,
  TimerIcon,
  WindIcon
} from '@lucide/svelte'

export type ToolCategory = 'Equipment' | 'Nutrition' | 'Performance'

export type Tool = {
  category: ToolCategory
  description: string
  href: null | string
  Icon: typeof Icon
  id: string
  title: string
  /** Surfaced in the landing nav Tools menu. */
  featured?: boolean
}

export const TOOL_CATEGORIES: ToolCategory[] = ['Equipment', 'Nutrition', 'Performance']

export const STATIC_TOOLS: Tool[] = [
  {
    category: 'Equipment',
    description: 'Compare chainrings, cassettes, cadence, and tire size before changing parts.',
    featured: true,
    href: null,
    Icon: CogIcon,
    id: 'gear-ratio',
    title: 'Gear-ratio visualizer'
  },
  {
    category: 'Equipment',
    description: 'Estimate starting pressure from rider weight, tire width, surface, and setup.',
    featured: true,
    href: null,
    Icon: GaugeIcon,
    id: 'tire-pressure',
    title: 'Tire pressure calculator'
  },
  {
    category: 'Nutrition',
    description: 'Turn ride duration and intensity into a simple carbs-per-hour target.',
    featured: true,
    href: null,
    Icon: CandyIcon,
    id: 'fueling',
    title: 'Cycling fueling calculator'
  },
  {
    category: 'Nutrition',
    description: 'Estimate bottles, sodium, and fluid range for hot or long rides.',
    featured: true,
    href: null,
    Icon: DropletsIcon,
    id: 'hydration',
    title: 'Hydration estimator'
  },
  {
    category: 'Nutrition',
    description: 'Build a pre-race carb load and breakfast target from body weight and event length.',
    href: null,
    Icon: FlagIcon,
    id: 'carb-loading',
    title: 'Carb loading calculator'
  },
  {
    category: 'Nutrition',
    description: 'Estimate fluid loss from pre-ride weight, post-ride weight, bottles, and ride duration.',
    featured: true,
    href: null,
    Icon: DropletsIcon,
    id: 'sweat-rate',
    title: 'Sweat rate calculator'
  },
  {
    category: 'Nutrition',
    description: 'Check whether your planned carbs, bottles, and sodium cover the ride ahead.',
    href: null,
    Icon: ClipboardCheckIcon,
    id: 'fueling-plan-evaluator',
    title: 'Fueling plan evaluator'
  },
  {
    category: 'Nutrition',
    description: 'Mix bottles by carbs, sodium, serving size, and bottle volume without kitchen math.',
    href: null,
    Icon: FlaskConicalIcon,
    id: 'bottle-mix',
    title: 'Bottle mix calculator'
  },
  {
    category: 'Nutrition',
    description: 'Estimate caffeine dose and timing from body weight, event start, and target intake.',
    featured: true,
    href: null,
    Icon: CoffeeIcon,
    id: 'caffeine-timing',
    title: 'Caffeine timing calculator'
  },
  {
    category: 'Performance',
    description: 'Convert watts, gradient, mass, and wind into a rough climbing or TT speed.',
    featured: true,
    href: null,
    Icon: WindIcon,
    id: 'power-speed',
    title: 'Power to speed calculator'
  },
  {
    category: 'Performance',
    description: 'Calculate watts per kilogram from rider weight and power targets.',
    href: null,
    Icon: ScaleIcon,
    id: 'watts-per-kilo',
    title: 'Watts per kilo calculator'
  },
  {
    category: 'Performance',
    description: 'Turn FTP into endurance, tempo, threshold, VO2, and anaerobic training zones.',
    featured: true,
    href: null,
    Icon: ChartNoAxesCombinedIcon,
    id: 'ftp-zones',
    title: 'FTP zone calculator'
  },
  {
    category: 'Performance',
    description: 'Estimate bike split pace from distance, target time, speed, or event plan.',
    href: null,
    Icon: TimerIcon,
    id: 'bike-split',
    title: 'Bike split calculator'
  },
  {
    category: 'Performance',
    description: 'Estimate climb time from elevation gain, gradient, rider weight, and target power.',
    href: null,
    Icon: MountainIcon,
    id: 'climbing-time',
    title: 'Climbing time calculator'
  },
  {
    category: 'Equipment',
    description: 'Check if your gearing gives enough cadence range for a target climb or event.',
    href: null,
    Icon: CogIcon,
    id: 'gearing-evaluator',
    title: 'Gearing evaluator'
  }
]
