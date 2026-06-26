<script lang="ts">
    import type { WithoutChildrenOrChild } from '../utils.js'

    import CircleIcon from '@lucide/svelte/icons/circle'
    import { RadioGroup as RadioGroupPrimitive } from 'bits-ui'

    import { cn } from '../utils.js'

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props()
</script>

<RadioGroupPrimitive.Item
    class={cn(
        'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        className
    )}
    bind:ref
    data-slot="radio-group-item"
    {...restProps}
>
    {#snippet children({ checked })}
        <div class="relative flex items-center justify-center" data-slot="radio-group-indicator">
            {#if checked}
                <CircleIcon
                    class="absolute inset-s-1/2 top-1/2 size-2 -translate-1/2 fill-primary"
                />
            {/if}
        </div>
    {/snippet}
</RadioGroupPrimitive.Item>
