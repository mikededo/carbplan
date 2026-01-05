import { describe, expect, it } from 'vitest'

import { formatPercentRange } from './types'

describe('formatPercentRange', () => {
  it('formats a range with both min and max', () => {
    expect(formatPercentRange(50, 60)).toBe('50-60%')
    expect(formatPercentRange(0, 55)).toBe('0-55%')
    expect(formatPercentRange(90, 100)).toBe('90-100%')
  })

  it('formats a range with null max as open-ended', () => {
    expect(formatPercentRange(150, null)).toBe('150%+')
    expect(formatPercentRange(100, null)).toBe('100%+')
  })

  it('handles zero min correctly', () => {
    expect(formatPercentRange(0, 50)).toBe('0-50%')
    expect(formatPercentRange(0, null)).toBe('0%+')
  })
})

