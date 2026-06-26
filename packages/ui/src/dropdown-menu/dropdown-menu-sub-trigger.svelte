<script lang="ts">
    import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
    import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        inset,
        ref = $bindable(null),
        ...restProps
    }: {
        inset?: boolean
    } & DropdownMenuPrimitive.SubTriggerProps = $props()
</script>

<DropdownMenuPrimitive.SubTrigger
    class={cn(
        'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:ps-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
        className
    )}
    bind:ref
    data-inset={inset}
    data-slot="dropdown-menu-sub-trigger"
    {...restProps}
>
    {@render children?.()}
    <ChevronRightIcon class="ms-auto size-4" />
</DropdownMenuPrimitive.SubTrigger>
