<script lang="ts" module>
    import type { VariantProps } from 'tailwind-variants'

    import { tv } from 'tailwind-variants'

    export const alertVariants = tv({
        base: 'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
        defaultVariants: {
            variant: 'default'
        },
        variants: {
            variant: {
                default: 'bg-card text-card-foreground',
                destructive: 'border-none bg-destructive/10 text-destructive dark:bg-destructive/15',
                info: 'border-none bg-primary/5 text-primary dark:bg-primary/15',
                success: 'border-none bg-emerald-600/10 text-emerald-500 dark:bg-emerald-600/15',
                warning: 'border-none bg-amber-600/10 text-amber-500 dark:bg-amber-600/15'
            }
        }
    })

    export type AlertVariant = VariantProps<typeof alertVariants>['variant']
</script>

<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        ref = $bindable(null),
        variant = 'default',
        ...restProps
    }: {
        variant?: AlertVariant
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn(alertVariants({ variant }), className)}
    bind:this={ref}
    data-slot="alert"
    {...restProps}
    role="alert"
>
    {@render children?.()}
</div>
