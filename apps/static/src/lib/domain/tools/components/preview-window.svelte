<script lang="ts">
    import type { Snippet } from 'svelte'

    import { entryStyles } from '../../marketing/helpers'

    type Props = {
        children: Snippet
        isVisible: boolean
        title: string
        badge?: Snippet
    }
    const { badge, children, isVisible, title }: Props = $props()
</script>

<div
    class="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-700"
    style={entryStyles(isVisible, { transform: 'scale' })}
>
    <div class="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
        <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
                <div class="size-3 rounded-full bg-red-400"></div>
                <div class="size-3 rounded-full bg-yellow-400"></div>
                <div class="size-3 rounded-full bg-green-400"></div>
            </div>
            <span class="text-sm font-medium">{title}</span>
        </div>
        {@render badge?.()}
    </div>

    <div class="p-6">
        {@render children()}
    </div>
</div>
