<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props()
</script>

<thead
    class={cn('[&_tr]:border-b', className)}
    bind:this={ref}
    data-slot="table-header"
    {...restProps}
>
    {@render children?.()}
</thead>

