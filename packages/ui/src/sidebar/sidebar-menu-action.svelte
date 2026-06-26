<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { HTMLButtonAttributes } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    let {
        child,
        children,
        class: className,
        ref = $bindable(null),
        showOnHover = false,
        ...restProps
    }: {
        child?: Snippet<[{ props: Record<string, unknown> }]>
        showOnHover?: boolean
    } & WithElementRef<HTMLButtonAttributes> = $props()

    const showOnHoverClass = 'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0'

    const mergedProps = $derived({
        class: cn(
            'absolute inset-e-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
            'after:absolute after:-inset-2 md:after:hidden',
            'peer-data-[size=sm]/menu-button:top-1',
            'peer-data-[size=default]/menu-button:top-1.5',
            'peer-data-[size=lg]/menu-button:top-2.5',
            'group-data-[collapsible=icon]:hidden',
            showOnHover && showOnHoverClass,
            className
        ),
        'data-sidebar': 'menu-action',
        'data-slot': 'sidebar-menu-action',
        ...restProps
    })
</script>

{#if child}
    {@render child({ props: mergedProps })}
{:else}
    <button bind:this={ref} {...mergedProps}>
        {@render children?.()}
    </button>
{/if}
