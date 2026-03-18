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
    class={cn('flex flex-col gap-1.5 p-4', className)}
    bind:this={ref}
    data-slot="sheet-header"
    {...restProps}
>
    {@render children?.()}
</div>
