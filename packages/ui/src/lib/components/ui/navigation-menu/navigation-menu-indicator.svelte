<script lang="ts">
    import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: NavigationMenuPrimitive.IndicatorProps = $props()
</script>

<NavigationMenuPrimitive.Indicator
    class={cn(
        'top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in',
        className
    )}
    bind:ref
    data-slot="navigation-menu-indicator"
    {...restProps}
>
    <div class="rounded-ts-sm relative top-[60%] size-2 rotate-45 bg-border shadow-md"></div>
</NavigationMenuPrimitive.Indicator>

