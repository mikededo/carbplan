<script lang="ts">
    import type { HTMLTdAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLTdAttributes> = $props()
</script>

<td
    class={cn(
        'bg-clip-padding p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0',
        className
    )}
    bind:this={ref}
    data-slot="table-cell"
    {...restProps}
>
    {@render children?.()}
</td>

