<script lang="ts">
    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import ChevronUpIcon from '@lucide/svelte/icons/chevron-up'
    import { Select as SelectPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props()
</script>

<SelectPrimitive.ScrollUpButton
    class={cn('flex cursor-default items-center justify-center py-1', className)}
    bind:ref
    data-slot="select-scroll-up-button"
    {...restProps}
>
    <ChevronUpIcon class="size-4" />
</SelectPrimitive.ScrollUpButton>
