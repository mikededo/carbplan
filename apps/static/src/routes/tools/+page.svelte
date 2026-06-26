<script lang="ts">
    import LandingFooter from '$lib/domain/marketing/components/landing-footer.svelte'
    import LandingNav from '$lib/domain/marketing/components/landing-nav.svelte'
    import ToolsCta from '$lib/domain/tools/components/tools-cta.svelte'
    import ToolsGrid from '$lib/domain/tools/components/tools-grid.svelte'
    import ToolsHero from '$lib/domain/tools/components/tools-hero.svelte'
    import { STATIC_TOOLS } from '$lib/domain/tools/tools'
</script>

<div class="min-h-screen bg-background">
    <LandingNav />

    <div class="mx-auto flex max-w-6xl flex-col gap-16 pt-32 pb-16">
        <ToolsHero />
        <ToolsGrid tools={STATIC_TOOLS} />
    </div>

    <ToolsCta />
    <LandingFooter />
</div>
