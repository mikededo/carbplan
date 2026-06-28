<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('w-full text-sm', className)}
    bind:this={ref}
    data-sidebar="group-content"
    data-slot="sidebar-group-content"
    {...restProps}
>
    {@render children?.()}
</div>
