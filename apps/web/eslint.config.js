import { svelteConfig, tailwindConfig } from '@kilo/eslint'

export default svelteConfig({ markdown: false }).append(tailwindConfig('./src/routes/root.css'))
