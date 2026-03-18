<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props()
</script>

<li
    class={cn('group/menu-item relative', className)}
    bind:this={ref}
    data-sidebar="menu-item"
    data-slot="sidebar-menu-item"
    {...restProps}
>
    {@render children?.()}
</li>
