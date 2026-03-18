import type { ZoneModelInfo, ZonePreset } from '$lib/domain/zones/zone'

import type { PowerZoneModel } from './schemas'

export const POWER_ZONE_PRESETS: Record<Exclude<PowerZoneModel, 'custom'>, ZonePreset[]> = {
  coggan: [
    {
      color: '#94a3b8',
      description: 'Very easy spinning, promotes recovery without training stress',
      maxPercent: 55,
      minPercent: 0,
      name: 'Active Recovery'
    },
    {
      color: '#22c55e',
      description: 'All-day pace, builds aerobic base and fat oxidation',
      maxPercent: 75,
      minPercent: 55,
      name: 'Endurance'
    },
    {
      color: '#eab308',
      description: 'Steady state riding, improves aerobic capacity',
      maxPercent: 90,
      minPercent: 75,
      name: 'Tempo'
    },
    {
      color: '#f97316',
      description: 'At functional threshold power, maximum sustainable effort',
      maxPercent: 105,
      minPercent: 90,
      name: 'Threshold'
    },
    {
      color: '#ef4444',
      description: 'Hard intervals that stress VO2max systems',
      maxPercent: 120,
      minPercent: 105,
      name: 'VO2max'
    },
    {
      color: '#dc2626',
      description: 'Short, very hard efforts developing anaerobic capacity',
      maxPercent: 150,
      minPercent: 120,
      name: 'Anaerobic'
    },
    {
      color: '#a020f0',
      description: 'Maximum sprints, develops peak power and neuromuscular coordination',
      maxPercent: null,
      minPercent: 150,
      name: 'Neuromuscular'
    }
  ],
  friel: [
    {
      color: '#94a3b8',
      description: 'Easy spinning or light pedaling with very little effort',
      maxPercent: 55,
      minPercent: 0,
      name: 'Recovery'
    },
    {
      color: '#22c55e',
      description: 'All-day pace, primary zone for building aerobic endurance',
      maxPercent: 75,
      minPercent: 55,
      name: 'Aerobic'
    },
    {
      color: '#eab308',
      description: 'Steady, faster riding that requires concentration',
      maxPercent: 90,
      minPercent: 75,
      name: 'Tempo'
    },
    {
      color: '#f97316',
      description: 'Just below threshold, challenging but sustainable for 20-60 min',
      maxPercent: 100,
      minPercent: 90,
      name: 'SubThreshold'
    },
    {
      color: '#ef4444',
      description: 'At or slightly above threshold, sustainable for 10-30 min',
      maxPercent: 106,
      minPercent: 100,
      name: 'SuperThreshold'
    },
    {
      color: '#dc2626',
      description: 'Hard 3-8 minute efforts, significant anaerobic contribution',
      maxPercent: 121,
      minPercent: 106,
      name: 'Aerobic Capacity'
    },
    {
      color: '#a020f0',
      description: 'Very short, very hard efforts for sprint power',
      maxPercent: null,
      minPercent: 121,
      name: 'Anaerobic Capacity'
    }
  ],
  polarized: [
    {
      color: '#22c55e',
      description: 'Easy aerobic training, majority of training volume',
      maxPercent: 80,
      minPercent: 0,
      name: 'Low Intensity'
    },
    {
      color: '#eab308',
      description: 'Threshold zone, minimize time here in polarized training',
      maxPercent: 100,
      minPercent: 80,
      name: 'Threshold'
    },
    {
      color: '#ef4444',
      description: 'High intensity intervals, key sessions for performance gains',
      maxPercent: null,
      minPercent: 100,
      name: 'High Intensity'
    }
  ],
  'sweet-spot': [
    {
      color: '#94a3b8',
      description: 'Very easy spinning for recovery',
      maxPercent: 55,
      minPercent: 0,
      name: 'Recovery'
    },
    {
      color: '#22c55e',
      description: 'Aerobic base building at comfortable pace',
      maxPercent: 75,
      minPercent: 55,
      name: 'Endurance'
    },
    {
      color: '#f97316',
      description: 'Sweet spot training: high training stimulus with manageable fatigue',
      maxPercent: 97,
      minPercent: 84,
      name: 'Sweet Spot'
    },
    {
      color: '#ef4444',
      description: 'At functional threshold power',
      maxPercent: 105,
      minPercent: 97,
      name: 'Threshold'
    },
    {
      color: '#dc2626',
      description: 'Above threshold, VO2max and anaerobic efforts',
      maxPercent: null,
      minPercent: 105,
      name: 'VO2max+'
    }
  ]
}

export const POWER_MODEL_INFO: Record<Exclude<PowerZoneModel, 'custom'>, ZoneModelInfo> = {
  coggan: {
    description: 'Dr. Andrew Coggan\'s classic 7-zone model based on FTP. The most widely used power zone system.',
    label: 'Coggan 7-Zone',
    referenceUrl: 'https://www.trainingpeaks.com/learn/articles/power-training-levels/'
  },
  friel: {
    description: 'Joe Friel\'s 7-zone model with different zone boundaries. Popular in triathlon training.',
    label: 'Joe Friel 7-Zone',
    referenceUrl: 'https://joefrieltraining.com/'
  },
  polarized: {
    description: 'Simple 3-zone model emphasizing low and high intensity, minimizing threshold work.',
    label: 'Polarized 3-Zone',
    referenceUrl: 'https://www.trainingpeaks.com/blog/what-is-polarized-training/'
  },
  'sweet-spot': {
    description: 'Focuses on the "sweet spot" zone (84-97% FTP) for efficient training adaptations.',
    label: 'Sweet Spot 5-Zone',
    referenceUrl: 'https://www.trainerroad.com/blog/sweet-spot-training-everything-you-need-to-know/'
  }
}

export const POWER_MODEL_LABELS: Record<PowerZoneModel, string> = {
  coggan: POWER_MODEL_INFO.coggan.label,
  custom: 'Custom',
  friel: POWER_MODEL_INFO.friel.label,
  polarized: POWER_MODEL_INFO.polarized.label,
  'sweet-spot': POWER_MODEL_INFO['sweet-spot'].label
}
