<script lang="ts">
    import type { ButtonVariant } from '$lib/domain/ui/button/index.js'

    import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
    import { Calendar as CalendarPrimitive } from 'bits-ui'

    import { buttonVariants } from '$lib/domain/ui/button/index.js'
    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        variant = 'ghost',
        ...restProps
    }: {
        variant?: ButtonVariant
    } & CalendarPrimitive.NextButtonProps = $props()
</script>

{#snippet Fallback()}
    <ChevronRightIcon class="size-4" />
{/snippet}

<CalendarPrimitive.NextButton
    class={cn(
        buttonVariants({ variant }),
        'size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50 rtl:rotate-180',
        className
    )}
    bind:ref
    children={children || Fallback}
    {...restProps}
/>
