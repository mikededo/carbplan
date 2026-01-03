<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        inset,
        ref = $bindable(null),
        ...restProps
    }: {
        inset?: boolean
    } & ComponentProps<typeof DropdownMenuPrimitive.GroupHeading> = $props()
</script>

<DropdownMenuPrimitive.GroupHeading
    class={cn('px-2 py-1.5 text-sm font-semibold data-[inset]:ps-8', className)}
    bind:ref
    data-inset={inset}
    data-slot="dropdown-menu-group-heading"
    {...restProps}
/>
