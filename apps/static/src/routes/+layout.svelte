<script lang="ts">
    import './root.css'

    const { children } = $props()
</script>

<svelte:head>
    <title>Kilo</title>
</svelte:head>

{@render children()}
