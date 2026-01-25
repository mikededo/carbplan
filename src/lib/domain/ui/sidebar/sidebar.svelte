<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import * as Sheet from '$lib/domain/ui/sheet/index.js'
    import { cn } from '$lib/utils.js'

    import { SIDEBAR_WIDTH_MOBILE } from './constants.js'
    import { useSidebar } from './context.svelte.js'

    let {
        children,
        class: className,
        collapsible = 'offcanvas',
        ref = $bindable(null),
        side = 'left',
        variant = 'sidebar',
        ...restProps
    }: {
        collapsible?: 'icon' | 'none' | 'offcanvas'
        side?: 'left' | 'right'
        variant?: 'floating' | 'inset' | 'sidebar'
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()

    const sidebar = useSidebar()
</script>

{#if collapsible === 'none'}
    <div
        class={cn(
            'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
            className
        )}
        bind:this={ref}
        {...restProps}
    >
        {@render children?.()}
    </div>
{:else if sidebar.isMobile}
    <Sheet.Root
        bind:open={() => sidebar.openMobile, (v) => sidebar.setOpenMobile(v)}
        {...restProps}
    >
        <Sheet.Content
            class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
            {side}
            data-mobile="true"
            data-sidebar="sidebar"
            data-slot="sidebar"
        >
            <Sheet.Header class="sr-only">
                <Sheet.Title>Sidebar</Sheet.Title>
                <Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
            </Sheet.Header>
            <div class="flex h-full w-full flex-col">
                {@render children?.()}
            </div>
        </Sheet.Content>
    </Sheet.Root>
{:else}
    <div
        class="group peer hidden text-sidebar-foreground md:block"
        bind:this={ref}
        data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
        data-side={side}
        data-slot="sidebar"
        data-state={sidebar.state}
        data-variant={variant}
    >
        <!-- This is what handles the sidebar gap on desktop -->
        <div
            class={cn(
                'relative w-(--sidebar-width) bg-transparent transition-[width] duration-150 ease-out',
                'group-data-[collapsible=offcanvas]:w-0',
                'group-data-[side=right]:rotate-180',
                variant === 'floating' || variant === 'inset'
                    ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                    : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
            )}
            data-slot="sidebar-gap"
        ></div>
        <div
            class={cn(
                'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-150 ease-out md:flex',
                side === 'left'
                    ? 'start-0 group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]'
                    : 'end-0 group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]',
                // Adjust the padding for floating and inset variants.
                variant === 'floating' || variant === 'inset'
                    ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                    : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s',
                className
            )}
            data-slot="sidebar-container"
            {...restProps}
        >
            <div
                class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
                data-sidebar="sidebar"
                data-slot="sidebar-inner"
            >
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
