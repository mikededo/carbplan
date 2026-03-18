<script lang="ts">
    import type { ComponentProps, Snippet } from 'svelte'

    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import XIcon from '@lucide/svelte/icons/x'
    import { Dialog as DialogPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    import DialogPortal from './dialog-portal.svelte'
    import * as Dialog from './index.js'

    let {
        children,
        class: className,
        portalProps,
        ref = $bindable(null),
        showCloseButton = true,
        ...restProps
    }: {
        children: Snippet
        portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DialogPortal>>
        showCloseButton?: boolean
    } & WithoutChildrenOrChild<DialogPrimitive.ContentProps> = $props()
</script>

<DialogPortal {...portalProps}>
    <Dialog.Overlay />
    <DialogPrimitive.Content
        class={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
            className
        )}
        bind:ref
        data-slot="dialog-content"
        {...restProps}
    >
        {@render children?.()}
        {#if showCloseButton}
            <DialogPrimitive.Close
                class="absolute end-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
                <XIcon />
                <span class="sr-only">Close</span>
            </DialogPrimitive.Close>
        {/if}
    </DialogPrimitive.Content>
</DialogPortal>
