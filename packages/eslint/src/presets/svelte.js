import svelteSortAttributes from 'eslint-plugin-svelte-sort-attributes'

import { baseConfig } from './base.js'

/**
 * @param {Parameters<typeof baseConfig>[0]} args
 */
export const svelteConfig = (args) => baseConfig({ ...args, svelte: true })
  .append({ ignores: ['**/*/.svelte-kit'] })
  .override('antfu/svelte/rules', {
    ignores: ['**/*.svelte.ts'],
    rules: {
      'style/indent-binary-ops': ['error', 4],
      'svelte/html-closing-bracket-new-line': ['error'],
      'svelte/html-quotes': ['error', { prefer: 'double' }],
      'svelte/indent': ['error', { indent: 4 }],
      'svelte/max-attributes-per-line': [
        'error',
        { multiline: 1, singleline: 3 }
      ],
      'svelte/no-inspect': ['error']
    }
  })
  .append(
    {
      files: ['**/*.svelte'],
      plugins: { 'svelte-sort-attributes': svelteSortAttributes },
      rules: {
        'svelte-sort-attributes/sort-attributes': [
          'error',
          {
            customGroups: {
              aria: 'aria-*',
              'bind-directives': 'bind:*',
              'bind-this': 'bind:this',
              class: 'class',
              data: 'data-*',
              effects: 'on*',
              'style-props': '--style-props',
              this: 'this',
              'use-directives': 'use:*'
            },
            groups: [
              ['this', 'bind-this'],
              'style-props',
              'class',
              ['bind-directives', 'use-directives'],
              'unknown',
              ['shorthand', 'svelte-shorthand'],
              'effects',
              'aria',
              'data',
              'multiline'
            ],
            ignoreCase: true,
            order: 'asc',
            type: 'alphabetical'
          }
        ]
      }
    }
  )
  .append(
    {
      files: ['**/*.svelte'],
      rules: {
        'style/indent-binary-ops': ['error', 4],
        'svelte/html-closing-bracket-new-line': ['error'],
        'svelte/html-quotes': ['error', { prefer: 'double' }],
        'svelte/indent': ['error', { indent: 4 }],
        'svelte/max-attributes-per-line': [
          'error',
          { multiline: 1, singleline: 3 }
        ],
        'svelte/no-inspect': ['error']
      }
    }
  )
