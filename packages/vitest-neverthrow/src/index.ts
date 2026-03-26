import type { Vite, VitestPluginContext } from 'vitest/node'

import { fileURLToPath } from 'node:url'

export { registerNeverthrowMatchers } from './matchers'

type VitestConfigurablePlugin = {
  configureVitest?: (context: VitestPluginContext) => void
} & Vite.Plugin

const setupFilePath = fileURLToPath(new URL('./setup.ts', import.meta.url))

const normalizeSetupFiles = (setupFiles: unknown): string[] => {
  if (!setupFiles) {
    return []
  }

  if (typeof setupFiles === 'string') {
    return [setupFiles]
  }

  return Array.isArray(setupFiles) ? [...setupFiles] : []
}

const injectSetupFile = (context: VitestPluginContext) => {
  const setupFiles = normalizeSetupFiles(context.vitest.config.setupFiles)

  if (!setupFiles.includes(setupFilePath)) {
    setupFiles.push(setupFilePath)
  }

  context.vitest.config.setupFiles = setupFiles
}

export const neverthrowPlugin = (): VitestConfigurablePlugin => ({
  configureVitest(context: VitestPluginContext) {
    injectSetupFile(context)
  },
  name: 'vitest-neverthrow'
})
