import { svelteConfig, tailwindConfig } from '@kilo/eslint'

export default svelteConfig({
  ignores: ['src/lib/domain/i18n/**'],
  markdown: false
}).append(tailwindConfig('./src/routes/root.css'))
