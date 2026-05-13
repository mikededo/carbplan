<script lang="ts">
    import '../root.css'

    import { createThemeContext } from '$lib/domain/theme/context.svelte'

    const { children } = $props()

    createThemeContext()
</script>

<svelte:head>
    <title>CarbPlan</title>
</svelte:head>

{@render children()}
