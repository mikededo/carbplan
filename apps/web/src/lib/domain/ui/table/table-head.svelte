<script lang="ts">
    import type { HTMLThAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLThAttributes> = $props()
</script>

<th
    class={cn(
        'text-foreground h-10 bg-clip-padding px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0',
        className
    )}
    bind:this={ref}
    data-slot="table-head"
    {...restProps}
>
    {@render children?.()}
</th>

