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

<tbody
    class={cn('[&_tr:last-child]:border-0', className)}
    bind:this={ref}
    data-slot="table-body"
    {...restProps}
>
    {@render children?.()}
</tbody>

