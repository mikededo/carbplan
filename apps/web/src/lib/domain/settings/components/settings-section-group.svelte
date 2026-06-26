<script lang="ts">
    import type { Snippet } from 'svelte'

    import { cn } from '@carbplan/ui/utils'

    type Props = {
        children: Snippet
        class?: string
    }
    const { children, class: className }: Props = $props()
</script>

<article class={cn('grid gap-4 sm:grid-cols-2', className)}>
    {@render children()}
</article>
