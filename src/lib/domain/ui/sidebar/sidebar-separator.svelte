<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { Separator } from '$lib/domain/ui/separator/index.js'
    import { cn } from '$lib/utils.js'

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
