<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props()
</script>

<ul
    class={cn(
        'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className
    )}
    bind:this={ref}
    data-sidebar="menu-sub"
    data-slot="sidebar-menu-sub"
    {...restProps}
>
    {@render children?.()}
</ul>
