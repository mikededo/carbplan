<script lang="ts">
    import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui'

    import { cn } from '../../../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: NavigationMenuPrimitive.ListProps = $props()
</script>

<NavigationMenuPrimitive.List
    class={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
    bind:ref
    data-slot="navigation-menu-list"
    {...restProps}
/>

