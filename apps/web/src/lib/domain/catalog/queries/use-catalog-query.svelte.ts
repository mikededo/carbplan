import { createQuery } from '@tanstack/svelte-query'

import { catalogOptions } from './catalog'

export const useCatalogQuery = () => createQuery(() => catalogOptions())
