export type ZonePreset = {
  color: string
  maxPercent: null | number
  minPercent: number
  name: string
  description?: string
}

export type ZoneModelInfo = {
  description: string
  label: string
  referenceUrl?: string
}

export const formatPercentRange = (min: number, max: null | number): string => {
  if (max === null) {
    return `${min}%+`
  }

  return `${min}-${max}%`
}

