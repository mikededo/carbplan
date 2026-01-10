<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { Separator } from '$lib/domain/ui/separator/index.js'
    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: {
        children?: Snippet
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()

    const hasContent = $derived(!!children)
</script>

<div
    class={cn(
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        className
    )}
    bind:this={ref}
    data-content={hasContent}
    data-slot="field-separator"
    {...restProps}
>
    <Separator class="absolute inset-0 top-1/2" />
    {#if children}
        <span
            class="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
            data-slot="field-separator-content"
        >
            {@render children()}
        </span>
    {/if}
</div>
