<script lang="ts">
    import type { ComponentProps } from 'svelte'

    import { Label } from '$lib/domain/ui/label/index.js'
    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        ...restProps
    }: ComponentProps<typeof Label> = $props()
</script>

<Label
    class={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
        'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10',
        className
    )}
    bind:ref
    data-slot="field-label"
    {...restProps}
>
    {@render children?.()}
</Label>
