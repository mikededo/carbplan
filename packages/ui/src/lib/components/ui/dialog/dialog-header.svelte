<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../../../utils.js'

    import { cn } from '../../../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn('flex flex-col gap-2 text-start', className)}
    bind:this={ref}
    data-slot="dialog-header"
    {...restProps}
>
    {@render children?.()}
</div>
