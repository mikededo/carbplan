<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props()
</script>

<span
    class={cn('text-muted-foreground ms-auto text-xs tracking-widest', className)}
    bind:this={ref}
    data-slot="dropdown-menu-shortcut"
    {...restProps}
>
    {@render children?.()}
</span>
