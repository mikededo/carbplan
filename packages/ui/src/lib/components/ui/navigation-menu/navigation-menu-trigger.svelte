<script lang="ts" module>
    import { tv } from 'tailwind-variants'

    import { cn } from '../../../utils.js'

    export const navigationMenuTriggerStyle = tv({
        base: 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground data-[state=open]:hover:bg-accent data-[state=open]:text-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent focus-visible:ring-ring/50 group inline-flex h-8 w-max items-center justify-center rounded-full px-3 py-0 text-sm font-normal transition-colors outline-none focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50'
    })
</script>

<script lang="ts">
    import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: NavigationMenuPrimitive.TriggerProps = $props()
</script>

<NavigationMenuPrimitive.Trigger
    class={cn(navigationMenuTriggerStyle(), 'group', className)}
    bind:ref
    data-slot="navigation-menu-trigger"
    {...restProps}
>
    {@render children?.()}
</NavigationMenuPrimitive.Trigger>

