<script lang="ts">
    import ToolsCta from '$lib/domain/tools/components/tools-cta.svelte'
    import ToolsGrid from '$lib/domain/tools/components/tools-grid.svelte'
    import ToolsHero from '$lib/domain/tools/components/tools-hero.svelte'
    import { STATIC_TOOLS } from '$lib/domain/tools/tools'
</script>

<div class="mx-auto flex max-w-6xl flex-col gap-16 pt-32 pb-16">
    <ToolsHero />
    <ToolsGrid tools={STATIC_TOOLS} />
</div>

<ToolsCta />
