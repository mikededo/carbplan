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

<p
    class={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
    )}
    bind:this={ref}
    data-slot="alert-description"
    {...restProps}
>
    {@render children?.()}
</p>
