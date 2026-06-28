<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import type { WithoutChildrenOrChild } from '../../../utils.js'

    import { Popover as PopoverPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'
    import PopoverPortal from './popover-portal.svelte'

    let {
        align = 'center',
        class: className,
        portalProps,
        ref = $bindable(null),
        sideOffset = 4,
        ...restProps
    }: {
        portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>
    } & PopoverPrimitive.ContentProps = $props()
</script>

<PopoverPortal {...portalProps}>
    <PopoverPrimitive.Content
        class={cn(
            'z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-popover outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            className
        )}
        bind:ref
        {align}
        {sideOffset}
        data-slot="popover-content"
        {...restProps}
    />
</PopoverPortal>
