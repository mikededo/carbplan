<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: { } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
    bind:this={ref}
    data-slot="select-label"
    {...restProps}
>
    {@render children?.()}
</div>
