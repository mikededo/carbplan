import type { ZonePreset } from '$lib/domain/zones/zone'

import type { PowerZoneModel } from './schemas'

export const POWER_ZONE_PRESETS: Record<Exclude<PowerZoneModel, 'custom'>, ZonePreset[]> = {
  coggan: [
    { color: '#94a3b8', maxPercent: 55, minPercent: 0, name: 'Active Recovery' },
    { color: '#22c55e', maxPercent: 75, minPercent: 55, name: 'Endurance' },
    { color: '#eab308', maxPercent: 90, minPercent: 75, name: 'Tempo' },
    { color: '#f97316', maxPercent: 105, minPercent: 90, name: 'Threshold' },
    { color: '#ef4444', maxPercent: 120, minPercent: 105, name: 'VO2max' },
    { color: '#dc2626', maxPercent: 150, minPercent: 120, name: 'Anaerobic' },
    { color: '#7c2d12', maxPercent: null, minPercent: 150, name: 'Neuromuscular' }
  ],
  polarized: [
    { color: '#22c55e', maxPercent: 80, minPercent: 0, name: 'Low Intensity' },
    { color: '#eab308', maxPercent: 100, minPercent: 80, name: 'Threshold' },
    { color: '#ef4444', maxPercent: null, minPercent: 100, name: 'High Intensity' }
  ],
  'sweet-spot': [
    { color: '#94a3b8', maxPercent: 55, minPercent: 0, name: 'Recovery' },
    { color: '#22c55e', maxPercent: 75, minPercent: 55, name: 'Endurance' },
    { color: '#f97316', maxPercent: 97, minPercent: 84, name: 'Sweet Spot' },
    { color: '#ef4444', maxPercent: 105, minPercent: 97, name: 'Threshold' },
    { color: '#dc2626', maxPercent: null, minPercent: 105, name: 'VO2max+' }
  ]
}

export const POWER_MODEL_LABELS: Record<PowerZoneModel, string> = {
  coggan: 'Coggan 7-Zone',
  custom: 'Custom',
  polarized: 'Polarized 3-Zone',
  'sweet-spot': 'Sweet Spot 5-Zone'
}

