<script lang="ts">
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements'

    import type { WithElementRef } from '../utils.js'

    import { cn } from '../utils.js'

    type InputType = Exclude<HTMLInputTypeAttribute, 'file'>

    type Props = WithElementRef<
        ({ files?: undefined, type?: InputType } | { type: 'file', files?: FileList }) &
        Omit<HTMLInputAttributes, 'type'>
    >

    let {
        class: className,
        'data-slot': dataSlot = 'input',
        files = $bindable(),
        ref = $bindable(null),
        type,
        value = $bindable(),
        ...restProps
    }: Props = $props()
</script>

{#if type === 'file'}
    <input
        class={cn(
            'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 pt-1.5 text-sm font-medium ring-offset-background transition-colors outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
            'focus-visible:border-primary/75 focus-visible:ring-[3px] focus-visible:ring-primary/50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            className
        )}
        bind:files
        bind:this={ref}
        bind:value
        type="file"
        data-slot={dataSlot}
        {...restProps}
    />
{:else}
    <input
        class={cn(
            'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base ring-offset-background transition-colors outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
            'focus-visible:border-primary/75 focus-visible:ring-[3px] focus-visible:ring-primary/50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            className
        )}
        bind:this={ref}
        bind:value
        {type}
        data-slot={dataSlot}
        {...restProps}
    />
{/if}
