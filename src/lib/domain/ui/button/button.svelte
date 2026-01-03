<script lang="ts" module>
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
    import type { VariantProps } from 'tailwind-variants'

    import type { WithElementRef } from '$lib/utils.js'

    import { tv } from 'tailwind-variants'

    import { cn } from '$lib/utils.js'

    export const buttonVariants = tv({
        base: `inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
        defaultVariants: {
            size: 'default',
            variant: 'default'
        },
        variants: {
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                icon: 'size-9',
                'icon-lg': 'size-10',
                'icon-sm': 'size-8',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5'
            },
            variant: {
                default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
                destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
                'destructive-ghost': 'text-destructive shadow-xs hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
                ghost: 'hover:bg-muted dark:hover:bg-muted/50',
                link: 'text-primary underline-offset-4 hover:underline',
                outline: 'border bg-background shadow-xs hover:bg-input/30 dark:border-input dark:hover:bg-input/50',
                secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80'
            }
        }
    })

    export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
    export type ButtonSize = VariantProps<typeof buttonVariants>['size']

    export type ButtonProps = {
        size?: ButtonSize
        variant?: ButtonVariant
    } & WithElementRef<HTMLAnchorAttributes> & WithElementRef<HTMLButtonAttributes>
</script>

<script lang="ts">
    let {
        children,
        class: className,
        disabled,
        href = undefined,
        ref = $bindable(null),
        size = 'default',
        type = 'button',
        variant = 'default',
        ...restProps
    }: ButtonProps = $props()
</script>

{#if href}
    <a
        class={cn(buttonVariants({ size, variant }), className)}
        bind:this={ref}
        href={disabled ? undefined : href}
        role={disabled ? 'link' : undefined}
        tabindex={disabled ? -1 : undefined}
        aria-disabled={disabled}
        data-slot="button"
        {...restProps}
    >
        {@render children?.()}
    </a>
{:else}
    <button
        class={cn(buttonVariants({ size, variant }), className)}
        bind:this={ref}
        {disabled}
        {type}
        data-slot="button"
        {...restProps}
    >
        {@render children?.()}
    </button>
{/if}
