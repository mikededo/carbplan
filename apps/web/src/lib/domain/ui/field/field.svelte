<script lang="ts" module>
    import type { VariantProps } from 'tailwind-variants'

    import { tv } from 'tailwind-variants'

    export const fieldVariants = tv({
        base: 'group/field flex w-full gap-2 data-[invalid=true]:text-destructive',
        defaultVariants: {
            orientation: 'vertical'
        },
        variants: {
            orientation: {
                horizontal: [
                    'flex-row items-center',
                    '[&>[data-slot=field-label]]:flex-auto',
                    'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
                ],
                responsive: [
                    'flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto',
                    '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
                    '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
                ],
                vertical: 'flex-col [&>*]:w-full [&>.sr-only]:w-auto'
            }
        }
    })

    export type FieldOrientation = VariantProps<typeof fieldVariants>['orientation']
</script>

<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements'

    import type { WithElementRef } from '$lib/utils.js'

    import { cn } from '$lib/utils.js'

    let {
        children,
        class: className,
        orientation = 'vertical',
        ref = $bindable(null),
        ...restProps
    }: {
        orientation?: FieldOrientation
    } & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    class={cn(fieldVariants({ orientation }), className)}
    bind:this={ref}
    role="group"
    data-orientation={orientation}
    data-slot="field"
    {...restProps}
>
    {@render children?.()}
</div>
