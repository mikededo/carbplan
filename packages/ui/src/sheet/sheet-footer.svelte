<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('mt-auto flex flex-col gap-2 p-4', className)}
    bind:this={ref}
    data-slot="sheet-footer"
    {...restProps}
>
    {@render children?.()}
</div>
