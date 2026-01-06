<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props()
</script>

<tfoot
    class={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    bind:this={ref}
    data-slot="table-footer"
    {...restProps}
>
    {@render children?.()}
</tfoot>
