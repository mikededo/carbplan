<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement> = $props()
</script>

<ul
    class={cn('flex w-full min-w-0 flex-col gap-1', className)}
    bind:this={ref}
    data-sidebar="menu"
    data-slot="sidebar-menu"
    {...restProps}
>
    {@render children?.()}
</ul>
