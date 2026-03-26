import type { VitestPluginContext } from 'vitest/node'

import { describe, expect, it } from 'vitest'

import { neverthrowPlugin } from './index'

const makeContext = (setupFiles?: string | string[]): VitestPluginContext => ({
  experimental_defineCacheKeyGenerator: () => { },
  injectTestProjects: async () => [],
  project: {} as never,
  vitest: {
    config: {
      setupFiles: setupFiles as never
    }
  } as never
})

describe('neverthrowPlugin', () => {
  it('injects setup file and keeps existing setup files', () => {
    const context = makeContext(['/tmp/existing-setup.ts'])
    const plugin = neverthrowPlugin()

    plugin.configureVitest?.(context)

    const setupFiles = context.vitest.config.setupFiles
    expect(setupFiles).toHaveLength(2)
    expect(setupFiles[0]).toBe('/tmp/existing-setup.ts')
    expect(setupFiles[1]).toMatch(/packages[\\/]vitest-neverthrow[\\/]src[\\/]setup\.ts$/)
  })

  it('deduplicates setup file injection', () => {
    const context = makeContext(['/tmp/existing-setup.ts'])
    const plugin = neverthrowPlugin()

    plugin.configureVitest?.(context)
    plugin.configureVitest?.(context)

    const setupFiles = context.vitest.config.setupFiles
    expect(setupFiles).toHaveLength(2)
  })

  it('normalizes string setupFiles into an array', () => {
    const context = makeContext('/tmp/existing-setup.ts')
    const plugin = neverthrowPlugin()

    plugin.configureVitest?.(context)

    const setupFiles = context.vitest.config.setupFiles
    expect(Array.isArray(setupFiles)).toBe(true)
    expect(setupFiles).toContain('/tmp/existing-setup.ts')
    expect(setupFiles.some((file) => file.endsWith('/setup.ts'))).toBe(true)
  })
})
