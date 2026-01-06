/**
 * Formats a product form value for display.
 * Converts snake_case to Title Case (e.g., 'drink_mix' -> 'Drink Mix')
 */
export const formatProductForm = (form: string): string =>
  form
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
