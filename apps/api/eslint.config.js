import { baseConfig } from '@carbplan/eslint'

import noContractsInImplementationRule from './eslint/rules/no-contracts-in-implementation.js'

const internalPlugin = {
  meta: { name: '@carbplan/api-internal' },
  rules: {
    'no-contracts-in-implementation': noContractsInImplementationRule
  }
}

export default baseConfig({ markdown: false }).append({
  files: [
    'src/modules/**/*repository.ts',
    'src/modules/**/*service.ts'
  ],
  plugins: {
    internal: internalPlugin
  },
  rules: {
    'internal/no-contracts-in-implementation': 'error'
  }
})
