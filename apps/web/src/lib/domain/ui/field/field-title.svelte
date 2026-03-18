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
    class={cn(
        'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
        className
    )}
    bind:this={ref}
    data-slot="field-title"
    {...restProps}
>
    {@render children?.()}
</div>
