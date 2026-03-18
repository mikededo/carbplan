<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props()
</script>

<tr
    class={cn('data-[state=selected]:bg-muted border-b transition-colors', className)}
    bind:this={ref}
    data-slot="table-row"
    {...restProps}
>
    {@render children?.()}
</tr>

