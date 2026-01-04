/**
 * Centralized query key factory for type-safe cache access.
 * Each domain should define its keys here.
 */
export const queryKeys = {
  athlete: {
    all: ['athlete'] as const,
    current: () => [...queryKeys.athlete.all, 'current'] as const
  }
} as const

