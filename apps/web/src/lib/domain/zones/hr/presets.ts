import type { ZoneModelInfo, ZonePreset } from '$lib/domain/zones/zone'

import type { HRZoneModel } from './schemas'

export const HR_ZONE_PRESETS: Record<Exclude<HRZoneModel, 'custom'>, ZonePreset[]> = {
  '5-zone': [
    {
      color: '#94a3b8',
      description: 'Very light activity for recovery and warm-up',
      maxPercent: 60,
      minPercent: 50,
      name: 'Zone 1 - Recovery'
    },
    {
      color: '#22c55e',
      description: 'Builds aerobic base and fat-burning capacity',
      maxPercent: 70,
      minPercent: 60,
      name: 'Zone 2 - Endurance'
    },
    {
      color: '#eab308',
      description: 'Improves aerobic capacity and muscular endurance',
      maxPercent: 80,
      minPercent: 70,
      name: 'Zone 3 - Tempo'
    },
    {
      color: '#f97316',
      description: 'Increases lactate threshold and sustainable power',
      maxPercent: 90,
      minPercent: 80,
      name: 'Zone 4 - Threshold'
    },
    {
      color: '#ef4444',
      description: 'Develops maximum oxygen uptake and anaerobic capacity',
      maxPercent: 100,
      minPercent: 90,
      name: 'Zone 5 - VO2max'
    }
  ],
  friel: [
    {
      color: '#94a3b8',
      description: 'Easy spinning or light pedaling with no real effort',
      maxPercent: 81,
      minPercent: 0,
      name: 'Zone 1 - Recovery'
    },
    {
      color: '#22c55e',
      description: 'All-day pace, used for long aerobic endurance training',
      maxPercent: 89,
      minPercent: 81,
      name: 'Zone 2 - Aerobic'
    },
    {
      color: '#eab308',
      description: 'Steady, moderate effort for extended periods',
      maxPercent: 93,
      minPercent: 90,
      name: 'Zone 3 - Tempo'
    },
    {
      color: '#f97316',
      description: 'Just below lactate threshold, challenging but sustainable',
      maxPercent: 99,
      minPercent: 94,
      name: 'Zone 4 - SubThreshold'
    },
    {
      color: '#ef4444',
      description: 'At or slightly above lactate threshold',
      maxPercent: 102,
      minPercent: 100,
      name: 'Zone 5a - SuperThreshold'
    },
    {
      color: '#dc2626',
      description: 'High intensity intervals, significant anaerobic contribution',
      maxPercent: 106,
      minPercent: 103,
      name: 'Zone 5b - Aerobic Capacity'
    },
    {
      color: '#a020f0',
      description: 'Maximum effort sprints and neuromuscular power',
      maxPercent: null,
      minPercent: 106,
      name: 'Zone 5c - Anaerobic Capacity'
    }
  ],
  karvonen: [
    {
      color: '#94a3b8',
      description: 'Light activity using heart rate reserve for recovery',
      maxPercent: 60,
      minPercent: 50,
      name: 'Recovery'
    },
    {
      color: '#22c55e',
      description: 'Builds aerobic foundation using HR reserve calculation',
      maxPercent: 70,
      minPercent: 60,
      name: 'Aerobic'
    },
    {
      color: '#eab308',
      description: 'Moderate intensity for sustained aerobic improvement',
      maxPercent: 80,
      minPercent: 70,
      name: 'Tempo'
    },
    {
      color: '#f97316',
      description: 'High intensity at lactate threshold',
      maxPercent: 90,
      minPercent: 80,
      name: 'Lactate Threshold'
    },
    {
      color: '#ef4444',
      description: 'Near-maximum effort for anaerobic development',
      maxPercent: 100,
      minPercent: 90,
      name: 'Anaerobic'
    }
  ]
}

export const HR_MODEL_INFO: Record<Exclude<HRZoneModel, 'custom'>, ZoneModelInfo> = {
  '5-zone': {
    description: 'Simple 5-zone model based on percentage of maximum heart rate. Easy to calculate and widely used.',
    label: '5-Zone (% HRmax)',
    referenceUrl: 'https://www.trainingpeaks.com/learn/articles/joe-friel-s-quick-guide-to-setting-zones/'
  },
  friel: {
    description: 'Joe Friel\'s 7-zone model based on lactate threshold heart rate (LTHR). Popular among triathletes and endurance athletes.',
    label: 'Joe Friel 7-Zone',
    referenceUrl: 'https://joefrieltraining.com/'
  },
  karvonen: {
    description: 'Uses heart rate reserve (HRmax - HRrest) for more personalized zones. Requires both max and resting HR.',
    label: 'Karvonen (HR Reserve)',
    referenceUrl: 'https://en.wikipedia.org/wiki/Heart_rate_reserve'
  }
}

export const HR_MODEL_LABELS: Record<HRZoneModel, string> = {
  '5-zone': HR_MODEL_INFO['5-zone'].label,
  custom: 'Custom',
  friel: HR_MODEL_INFO.friel.label,
  karvonen: HR_MODEL_INFO.karvonen.label
}
