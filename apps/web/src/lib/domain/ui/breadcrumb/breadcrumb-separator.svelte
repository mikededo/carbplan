<script lang="ts">
    import type { HTMLLiAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li
    class={cn('[&>svg]:size-3.5', className)}
    bind:this={ref}
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {:else}
        <ChevronRightIcon />
    {/if}
</li>
