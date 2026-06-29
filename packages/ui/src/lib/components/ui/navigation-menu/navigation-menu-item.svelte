<script lang="ts">
    import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: NavigationMenuPrimitive.ItemProps = $props()
</script>

<NavigationMenuPrimitive.Item
    class={cn('relative', className)}
    bind:ref
    data-slot="navigation-menu-item"
    {...restProps}
/>

