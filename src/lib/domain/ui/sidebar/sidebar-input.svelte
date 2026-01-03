<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { Input } from '$lib/domain/ui/input/index.js'
    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        value = $bindable(''),
        ...restProps
    }: ComponentProps<typeof Input> = $props()
</script>

<Input
    class={cn('bg-background h-8 w-full shadow-none', className)}
    bind:ref
    bind:value
    data-sidebar="input"
    data-slot="sidebar-input"
    {...restProps}
/>
