import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

/**
 * @param {string} entryPoint
 * @returns {import('eslint').Linter.Config} Tailwind configuration
 */
export const tailwindConfig = (entryPoint) => ({
  files: ['./src/**/*.{ts,svelte}'],
  ...betterTailwindcss.configs['stylistic-error'],
  rules: {
    ...betterTailwindcss.configs['stylistic-error'].rules,
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off'
  },
  settings: {
    'better-tailwindcss': {
      callees: ['tv', 'twMerge'],
      entryPoint
    }
  }
})
