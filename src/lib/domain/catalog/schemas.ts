// Product form enum - must match database enum `public.product_form`
// After running migration and `bun db:types`, this can be replaced with:
// import type { Database } from '$lib/database/types.g'
// export type ProductForm = Database['public']['Enums']['product_form']
export type ProductForm =
  | 'bar' |
  'capsule' |
  'chew' |
  'drink_mix' |
  'gel' |
  'liquid' |
  'powder' |
  'solid'

/**
 * Formats a product form value for display.
 * Converts snake_case to Title Case (e.g., 'drink_mix' -> 'Drink Mix')
 */
export const formatProductForm = (form: string): string =>
  form
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
