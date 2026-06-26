/**
 * Centralized query key factory for type-safe cache access.
 * Each domain should define its keys here.
 */
export const queryKeys = {
  athlete: {
    all: ['athlete'] as const,
    current: () => [...queryKeys.athlete.all, 'current'] as const
  },
  catalog: {
    admin: () => [...queryKeys.catalog.all, 'admin'] as const,
    all: ['catalog'] as const,
    products: () => [...queryKeys.catalog.all, 'products'] as const,
    public: () => [...queryKeys.catalog.all, 'public'] as const
  },
  favorites: {
    all: ['favorites'] as const,
    brands: () => [...queryKeys.favorites.all, 'brands'] as const,
    products: () => [...queryKeys.favorites.all, 'products'] as const
  },
  plans: {
    all: ['plans'] as const,
    detail: (id: string) => [...queryKeys.plans.all, 'detail', id] as const,
    list: () => [...queryKeys.plans.all, 'list'] as const,
    next: () => [...queryKeys.plans.all, 'next'] as const,
    recent: (limit: number) => [...queryKeys.plans.all, 'recent', limit] as const
  }
} as const
