<script lang="ts">
    import type { Snippet } from 'svelte'

    type Props = {
        children: Snippet
        header: Snippet | string
    }
    const { children, header }: Props = $props()
</script>

<section class="space-y-4">
    {#if typeof header === 'string'}
        <h2 class="text-lg font-semibold">{header}</h2>
    {:else}
        {@render header()}
    {/if}

    {@render children()}
</section>

