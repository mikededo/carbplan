<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        variant = 'legend',
        ...restProps
    }: {
        variant?: 'label' | 'legend'
    } & WithElementRef<HTMLAttributes<HTMLLegendElement>> = $props()
</script>

<legend
    class={cn(
        'mb-3 font-medium',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        className
    )}
    bind:this={ref}
    data-slot="field-legend"
    data-variant={variant}
    {...restProps}
>
    {@render children?.()}
</legend>
