<script lang="ts">
    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
    import { Select as SelectPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props()
</script>

<SelectPrimitive.ScrollDownButton
    class={cn('flex cursor-default items-center justify-center py-1', className)}
    bind:ref
    data-slot="select-scroll-down-button"
    {...restProps}
>
    <ChevronDownIcon class="size-4" />
</SelectPrimitive.ScrollDownButton>
