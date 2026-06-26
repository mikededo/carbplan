<script lang="ts">
    import type { HTMLTableAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLTableAttributes> = $props()
</script>

<table
    class={cn('w-full caption-bottom text-sm', className)}
    bind:this={ref}
    data-slot="table"
    {...restProps}
>
    {@render children?.()}
</table>

