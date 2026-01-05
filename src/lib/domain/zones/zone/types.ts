export type ZonePreset = {
  maxPercent: null | number
  minPercent: number
  name: string
  color: string
}

export const formatPercentRange = (min: number, max: null | number): string => {
  if (max === null) {
    return `${min}%+`
  }

  return `${min}-${max}%`
}

