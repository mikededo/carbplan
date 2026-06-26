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
        ...restProps
    }: {
        child?: Snippet<[{ props: Record<string, unknown> }]>
    } & WithElementRef<HTMLButtonAttributes> = $props()

    const mergedProps = $derived({
        class: cn(
            'absolute inset-e-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
            // Increases the hit area of the button on mobile.
            'after:absolute after:-inset-2 md:after:hidden',
            'group-data-[collapsible=icon]:hidden',
            className
        ),
        'data-sidebar': 'group-action',
        'data-slot': 'sidebar-group-action',
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
