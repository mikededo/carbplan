<script lang="ts" module>
    import type { VariantProps } from 'tailwind-variants'

    import { tv } from 'tailwind-variants'

    export const sidebarMenuButtonVariants = tv({
        base: 'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        defaultVariants: {
            size: 'default',
            variant: 'default'
        },
        variants: {
            size: {
                default: 'h-8 text-sm',
                lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
                sm: 'h-7 text-xs'
            },
            variant: {
                default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                outline:
                    'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]'
            }
        }
    })

    export type SidebarMenuButtonVariant = VariantProps<
        typeof sidebarMenuButtonVariants
    >['variant']
    export type SidebarMenuButtonSize = VariantProps<typeof sidebarMenuButtonVariants>['size']
</script>

<script lang="ts">
    import type { ComponentProps, Snippet } from 'svelte'
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef, WithoutChildrenOrChild } from '$lib/utils.js'

    import { mergeProps } from 'bits-ui'

    import * as Tooltip from '$lib/domain/ui/tooltip/index.js'
    import { cn } from '$lib/utils.js'

    import { useSidebar } from './context.svelte.js'

    let {
        child,
        children,
        class: className,
        isActive = false,
        ref = $bindable(null),
        size = 'default',
        tooltipContent,
        tooltipContentProps,
        variant = 'default',
        ...restProps
    }: {
        child?: Snippet<[{ props: Record<string, unknown> }]>
        isActive?: boolean
        size?: SidebarMenuButtonSize
        tooltipContent?: Snippet | string
        tooltipContentProps?: WithoutChildrenOrChild<ComponentProps<typeof Tooltip.Content>>
        variant?: SidebarMenuButtonVariant
    } & WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> = $props()

    const sidebar = useSidebar()

    const buttonProps = $derived({
        class: cn(sidebarMenuButtonVariants({ size, variant }), className),
        'data-active': isActive,
        'data-sidebar': 'menu-button',
        'data-size': size,
        'data-slot': 'sidebar-menu-button',
        ...restProps
    })
</script>

{#snippet Button({ props }: { props?: Record<string, unknown> })}
    {@const mergedProps = mergeProps(buttonProps, props)}
    {#if child}
        {@render child({ props: mergedProps })}
    {:else}
        <button bind:this={ref} {...mergedProps}>
            {@render children?.()}
        </button>
    {/if}
{/snippet}

{#if !tooltipContent}
    {@render Button({})}
{:else}
    <Tooltip.Root>
        <Tooltip.Trigger>
            {#snippet child({ props })}
                {@render Button({ props })}
            {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content
            align="center"
            hidden={sidebar.state !== 'collapsed' || sidebar.isMobile}
            side="right"
            {...tooltipContentProps}
        >
            {#if typeof tooltipContent === 'string'}
                {tooltipContent}
            {:else if tooltipContent}
                {@render tooltipContent()}
            {/if}
        </Tooltip.Content>
    </Tooltip.Root>
{/if}
