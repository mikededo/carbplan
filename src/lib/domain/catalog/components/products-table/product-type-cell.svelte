<script lang="ts">
    import type { ProductForm } from '$lib/database/types.g'

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

    import { formatProductForm } from '../../schemas'

    type Props = { form: null | ProductForm }
    const { form }: Props = $props()

    const FORM_ICONS: Record<ProductForm, typeof BoxIcon> = {
        bar: CookieIcon,
        capsule: PillIcon,
        chew: CandyIcon,
        drink_mix: GlassWaterIcon,
        gel: DropletsIcon,
        liquid: DropletIcon,
        powder: FlaskConicalIcon,
        solid: BoxIcon
    }

    const Icon = $derived(form ? FORM_ICONS[form] : null)
    const label = $derived(form ? formatProductForm(form) : '-')
</script>

{#if Icon}
    <span class="flex items-center gap-2">
        <Icon class="size-3.5 text-muted-foreground" />
        {label}
    </span>
{:else}
    {label}
{/if}
