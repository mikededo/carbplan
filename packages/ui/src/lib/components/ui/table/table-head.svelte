<script lang="ts">
    import type { HTMLThAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLThAttributes> = $props()
</script>

<th
    class={cn(
        'h-10 bg-clip-padding px-2 text-start align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pe-0',
        className
    )}
    bind:this={ref}
    data-slot="table-head"
    {...restProps}
>
    {@render children?.()}
</th>

