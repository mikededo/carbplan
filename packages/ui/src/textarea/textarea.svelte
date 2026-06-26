<script lang="ts">
    import type { HTMLTextareaAttributes } from 'svelte/elements'

    import type { WithElementRef, WithoutChildren } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        class: className,
        'data-slot': dataSlot = 'textarea',
        ref = $bindable(null),
        value = $bindable(),
        ...restProps
    }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props()
</script>

<textarea
    class={cn(
        'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        className
    )}
    bind:this={ref}
    bind:value
    data-slot={dataSlot}
    {...restProps}
></textarea>
