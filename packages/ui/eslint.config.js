import { svelteConfig, tailwindConfig } from '@carbplan/eslint'

export default svelteConfig({ markdown: false }).append(tailwindConfig('./src/styles.css'))
