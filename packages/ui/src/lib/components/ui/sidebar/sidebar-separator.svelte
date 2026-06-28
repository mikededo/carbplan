<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { cn } from '../../../utils.js'
    import { Separator } from '../separator/index.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: ComponentProps<typeof Separator> = $props()
</script>

<Separator
    class={cn('bg-sidebar-border', className)}
    bind:ref
    data-sidebar="separator"
    data-slot="sidebar-separator"
    {...restProps}
/>
