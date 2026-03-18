<script lang="ts" module>
    import type { ProductFormType } from '$lib/database/types.g'

    import {
        BoxIcon,
        CandyIcon,
        CookieIcon,
        DropletIcon,
        DropletsIcon,
        FlaskConicalIcon,
        GlassWaterIcon,
        PillIcon
    } from '@lucide/svelte'
    import { tv } from 'tailwind-variants'

    export const FORM_ICONS: Record<ProductFormType, typeof BoxIcon> = {
        bar: CookieIcon,
        capsule: PillIcon,
        chew: CandyIcon,
        drink_mix: GlassWaterIcon,
        gel: DropletsIcon,
        liquid: DropletIcon,
        powder: FlaskConicalIcon,
        solid: BoxIcon
    }

    export const productFormBadgeVariants = tv({
        base: 'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border-none px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3',
        variants: {
            form: {
                bar: 'bg-amber-600/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400',
                capsule: 'bg-slate-600/10 text-slate-700 dark:bg-slate-400/10 dark:text-slate-400',
                chew: 'bg-pink-600/10 text-pink-700 dark:bg-pink-400/10 dark:text-pink-400',
                drink_mix: 'bg-cyan-600/10 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-400',
                gel: 'bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400',
                liquid: 'bg-teal-600/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-400',
                powder: 'bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-400',
                solid: 'bg-stone-600/10 text-stone-700 dark:bg-stone-400/10 dark:text-stone-400'
            }
        }
    })

    export const formatProductForm = (form: string): string =>
        form
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
</script>

<script lang="ts">
    type Props = { form: ProductFormType }
    const { form }: Props = $props()

    const Icon = $derived(FORM_ICONS[form])
    const label = $derived(formatProductForm(form))
</script>

<span class={productFormBadgeVariants({ form })}>
    <Icon class="size-3" />
    {label}
</span>
