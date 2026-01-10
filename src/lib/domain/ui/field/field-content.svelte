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
    class={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}
    bind:this={ref}
    data-slot="field-content"
    {...restProps}
>
    {@render children?.()}
</div>
