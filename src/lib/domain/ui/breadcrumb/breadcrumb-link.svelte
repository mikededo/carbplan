<script lang="ts">
    import type { Snippet } from 'svelte'
    import type { HTMLAnchorAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        child,
        children,
        class: className,
        href = undefined,
        ref = $bindable(null),
        ...restProps
    }: {
        child?: Snippet<[{ props: HTMLAnchorAttributes }]>
    } & WithElementRef<HTMLAnchorAttributes> = $props()

    const attrs = $derived({
        class: cn('hover:text-foreground transition-colors', className),
        'data-slot': 'breadcrumb-link',
        href,
        ...restProps
    })
</script>

{#if child}
    {@render child({ props: attrs })}
{:else}
    <a bind:this={ref} {...attrs}>
        {@render children?.()}
    </a>
{/if}
