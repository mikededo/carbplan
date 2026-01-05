import type { ZonePreset } from '$lib/domain/zones/zone'

import type { HRZoneModel } from './schemas'

export const HR_ZONE_PRESETS: Record<Exclude<HRZoneModel, 'custom'>, ZonePreset[]> = {
  '5-zone': [
    { color: '#94a3b8', maxPercent: 60, minPercent: 50, name: 'Zone 1 - Recovery' },
    { color: '#22c55e', maxPercent: 70, minPercent: 60, name: 'Zone 2 - Endurance' },
    { color: '#eab308', maxPercent: 80, minPercent: 70, name: 'Zone 3 - Tempo' },
    { color: '#f97316', maxPercent: 90, minPercent: 80, name: 'Zone 4 - Threshold' },
    { color: '#ef4444', maxPercent: 100, minPercent: 90, name: 'Zone 5 - VO2max' }
  ],
  karvonen: [
    { color: '#94a3b8', maxPercent: 60, minPercent: 50, name: 'Recovery' },
    { color: '#22c55e', maxPercent: 70, minPercent: 60, name: 'Aerobic' },
    { color: '#eab308', maxPercent: 80, minPercent: 70, name: 'Tempo' },
    { color: '#f97316', maxPercent: 90, minPercent: 80, name: 'Lactate Threshold' },
    { color: '#ef4444', maxPercent: 100, minPercent: 90, name: 'Anaerobic' }
  ]
}

export const HR_MODEL_LABELS: Record<HRZoneModel, string> = {
  '5-zone': '5-Zone (% HRmax)',
  custom: 'Custom',
  karvonen: 'Karvonen (HR Reserve)'
}

