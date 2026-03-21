export const PRODUCT_FORM = [
  'gel',
  'bar',
  'chew',
  'drink_mix',
  'powder',
  'capsule',
  'liquid',
  'solid'
] as const
export type ProductForm = (typeof PRODUCT_FORM)[number]
