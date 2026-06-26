<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import type { WithoutChildrenOrChild } from '../utils.js'

    import { Tooltip as TooltipPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'
    import TooltipPortal from './tooltip-portal.svelte'

    let {
        arrowClasses,
        children,
        class: className,
        portalProps,
        ref = $bindable(null),
        side = 'top',
        sideOffset = 0,
        ...restProps
    }: {
        arrowClasses?: string
        portalProps?: WithoutChildrenOrChild<ComponentProps<typeof TooltipPortal>>
    } & TooltipPrimitive.ContentProps = $props()
</script>

<TooltipPortal {...portalProps}>
    <TooltipPrimitive.Content
        class={cn(
            'z-50 w-fit origin-(--bits-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className
        )}
        bind:ref
        {side}
        {sideOffset}
        data-slot="tooltip-content"
        {...restProps}
    >
        {@render children?.()}
        <TooltipPrimitive.Arrow>
            {#snippet child({ props })}
                <div
                    class={cn(
                        'z-50 size-2 rotate-45 bg-foreground',
                        'data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%+2px)]',
                        'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%+1px)]',
                        'data-[side=right]:translate-x-[calc(50%+2px)] data-[side=right]:translate-y-1/2',
                        'data-[side=left]:-translate-y-[calc(50%-3px)]',
                        arrowClasses
                    )}
                    {...props}
                ></div>
            {/snippet}
        </TooltipPrimitive.Arrow>
    </TooltipPrimitive.Content>
</TooltipPortal>
