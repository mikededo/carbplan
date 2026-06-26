<script lang="ts">
    import './root.css'

    const { children } = $props()
</script>

<svelte:head>
    <title>CarbPlan</title>
</svelte:head>

{@render children()}
