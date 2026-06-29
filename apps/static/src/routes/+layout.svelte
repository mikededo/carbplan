<script lang="ts">
    import { deepMerge, MetaTags } from 'svelte-meta-tags'

    import { page } from '$app/state'
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
