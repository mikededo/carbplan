import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    exclude: ['./src/test/utils.test.ts'],
    globals: true,
    include: ['./src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts']
  }
})
