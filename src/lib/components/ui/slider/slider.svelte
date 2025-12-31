<script lang="ts">
    import type { WithoutChildrenOrChild } from '$lib/utils.js'

    import { Slider as SliderPrimitive } from 'bits-ui'

    import { cn } from '$lib/utils.js'

    let {
        class: className,
        orientation = 'horizontal',
        ref = $bindable(null),
        value = $bindable(),
        ...restProps
    }: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props()
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
    class={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
    )}
    bind:ref
    bind:value={value as never}
    {orientation}
    data-slot="slider"
    {...restProps}
>
    {#snippet children({ thumbs })}
        <span
            class={cn(
                'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
            )}
            data-orientation={orientation}
            data-slot="slider-track"
        >
            <SliderPrimitive.Range
                class={cn(
                    'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
                )}
                data-slot="slider-range"
            />
        </span>
        {#each thumbs as thumb (thumb)}
            <SliderPrimitive.Thumb
                class="border-primary ring-ring/50 focus-visible:outline-hidden block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
                index={thumb}
                data-slot="slider-thumb"
            />
        {/each}
    {/snippet}
</SliderPrimitive.Root>
