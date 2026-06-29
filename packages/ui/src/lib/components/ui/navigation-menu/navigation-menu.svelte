<script lang="ts">
    import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'
    import NavigationMenuViewport from './navigation-menu-viewport.svelte'

    let {
        children,
        class: className,
        ref = $bindable(null),
        viewport = true,
        ...restProps
    }: {
        viewport?: boolean
    } & NavigationMenuPrimitive.RootProps = $props()
</script>

<NavigationMenuPrimitive.Root
    class={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className
    )}
    bind:ref
    data-slot="navigation-menu"
    data-viewport={viewport}
    {...restProps}
>
    {@render children?.()}

    {#if viewport}
        <NavigationMenuViewport />
    {/if}
</NavigationMenuPrimitive.Root>

