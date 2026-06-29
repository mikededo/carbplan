<script lang="ts">
    import type { Pathname } from '$app/types'

    import { deepMerge, MetaTags } from 'svelte-meta-tags'

    import { resolve } from '$app/paths'
    import { page } from '$app/state'
    import { locales, localizeHref } from '$lib/domain/i18n/runtime'
    import LandingFooter from '$lib/domain/marketing/components/landing-footer.svelte'
    import LandingNav from '$lib/domain/marketing/components/landing-nav.svelte'
    import './root.css'

    const { children, data } = $props()
    const metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags))
</script>

<MetaTags {...metaTags} />

<div class="min-h-screen bg-background">
    <LandingNav />
    {@render children()}
    <LandingFooter />
</div>

<div style="display:none">
    {#each locales as locale (locale)}
        <a
            href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
        >{locale}</a>
    {/each}
</div>
