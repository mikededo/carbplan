<script lang="ts">
    import type { Snippet } from 'svelte'

    import { cn } from '$lib/utils'

    type Props = {
        children: Snippet
        class?: string
    }
    const { children, class: className }: Props = $props()
</script>

<article class={cn('grid gap-4 sm:grid-cols-2', className)}>
    {@render children()}
</article>
