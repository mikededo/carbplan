<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props()
</script>

<tr
    class={cn('border-b transition-colors data-[state=selected]:bg-muted', className)}
    bind:this={ref}
    data-slot="table-row"
    {...restProps}
>
    {@render children?.()}
</tr>

