<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        inset,
        ref = $bindable(null),
        ...restProps
    }: {
        inset?: boolean
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('px-2 py-1.5 text-sm font-semibold data-[inset]:ps-8', className)}
    bind:this={ref}
    data-inset={inset}
    data-slot="dropdown-menu-label"
    {...restProps}
>
    {@render children?.()}
</div>
