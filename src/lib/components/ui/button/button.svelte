<script lang="ts" module>
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
    import type { VariantProps } from 'tailwind-variants'

    import type { WithElementRef } from '$lib/utils.js'

    import { tv } from 'tailwind-variants'

    import { cn } from '$lib/utils.js'

    export const buttonVariants = tv({
        base: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
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
                default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
                destructive:
                    'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-xs text-white',
                ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
                link: 'text-primary underline-offset-4 hover:underline',
                outline:
                    'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 shadow-xs border',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs'
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
