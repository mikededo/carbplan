<script lang="ts">
    import type { HTMLFieldsetAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: WithElementRef<HTMLFieldsetAttributes> = $props()
</script>

<fieldset
    class={cn(
        'flex flex-col gap-6',
        'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
    )}
    bind:this={ref}
    data-slot="field-set"
    {...restProps}
>
    {@render children?.()}
</fieldset>
