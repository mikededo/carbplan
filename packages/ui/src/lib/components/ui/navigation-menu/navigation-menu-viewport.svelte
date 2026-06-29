<script lang="ts">
    import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: NavigationMenuPrimitive.ViewportProps = $props()
</script>

<div class={cn('absolute inset-s-0 top-full isolate z-50 flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
        class={cn(
            'origin-top-center relative mt-1.5 h-(--bits-navigation-menu-viewport-height) w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-sm md:w-(--bits-navigation-menu-viewport-width)',
            className
        )}
        bind:ref
        data-slot="navigation-menu-viewport"
        {...restProps}
    />
</div>

