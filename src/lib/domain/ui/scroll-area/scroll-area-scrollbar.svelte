<script lang="ts">
    import type { WithoutChild } from '$lib/utils.js'

    import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        orientation = 'vertical',
        ref = $bindable(null),
        ...restProps
    }: WithoutChild<ScrollAreaPrimitive.ScrollbarProps> = $props()
</script>

<ScrollAreaPrimitive.Scrollbar
    class={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' && 'h-full w-2.5 border-s border-s-transparent',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        className
    )}
    bind:ref
    {orientation}
    data-slot="scroll-area-scrollbar"
    {...restProps}
>
    {@render children?.()}
    <ScrollAreaPrimitive.Thumb
        class="relative flex-1 rounded-full bg-border"
        data-slot="scroll-area-thumb"
    />
</ScrollAreaPrimitive.Scrollbar>
