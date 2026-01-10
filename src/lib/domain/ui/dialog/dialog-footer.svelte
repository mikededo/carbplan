<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

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
    data-slot="dialog-footer"
    {...restProps}
>
    {@render children?.()}
</div>
