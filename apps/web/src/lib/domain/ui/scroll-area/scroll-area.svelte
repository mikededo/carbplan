<script lang="ts">
    import type { WithoutChild } from '$lib/utils.js'

    import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    import { Scrollbar } from './index.js'

    let {
        children,
        class: className,
        orientation = 'vertical',
        ref = $bindable(null),
        scrollbarXClasses = '',
        scrollbarYClasses = '',
        viewportRef = $bindable(null),
        ...restProps
    }: {
        orientation?: 'both' | 'horizontal' | 'vertical' | undefined
        scrollbarXClasses?: string | undefined
        scrollbarYClasses?: string | undefined
        viewportRef?: HTMLElement | null
    } & WithoutChild<ScrollAreaPrimitive.RootProps> = $props()
</script>

<ScrollAreaPrimitive.Root
    class={cn('relative', className)}
    bind:ref
    data-slot="scroll-area"
    {...restProps}
>
    <ScrollAreaPrimitive.Viewport
        class="size-full rounded-[inherit] ring-ring/10 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 dark:ring-ring/20 dark:outline-ring/40"
        bind:ref={viewportRef}
        data-slot="scroll-area-viewport"
    >
        {@render children?.()}
    </ScrollAreaPrimitive.Viewport>
    {#if orientation === 'vertical' || orientation === 'both'}
        <Scrollbar class={scrollbarYClasses} orientation="vertical" />
    {/if}
    {#if orientation === 'horizontal' || orientation === 'both'}
        <Scrollbar class={scrollbarXClasses} orientation="horizontal" />
    {/if}
    <ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
