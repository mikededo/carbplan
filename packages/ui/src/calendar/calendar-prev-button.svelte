<script lang="ts">
    import type { ButtonVariant } from '../button/index.js'

    import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left'
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { buttonVariants } from '../button/index.js'
    import { cn } from '../utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        variant = 'ghost',
        ...restProps
    }: {
        variant?: ButtonVariant
    } & CalendarPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
    <ChevronLeftIcon class="size-4" />
{/snippet}

<CalendarPrimitive.PrevButton
    class={cn(
        buttonVariants({ variant }),
        'size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180',
        className
    )}
    bind:ref
    children={children || Fallback}
    {...restProps}
/>
