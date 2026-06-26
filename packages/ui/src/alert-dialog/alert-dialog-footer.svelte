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
    class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    bind:this={ref}
    data-slot="alert-dialog-footer"
    {...restProps}
>
    {@render children?.()}
</div>
