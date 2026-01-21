<script lang="ts">
    import type { PricingTier } from '../constants'

    import { CheckIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Badge } from '$lib/domain/ui/badge'
    import { Button } from '$lib/domain/ui/button'
    import { InView } from '$lib/hooks/in-view.svelte'
    import { cn } from '$lib/utils'

    import { PRICING_TIERS } from '../constants'

    type PricinTierProps = {
        tier: PricingTier
        position: number
    }

    const inView = new InView({ threshold: 0.2 })
</script>

<section class="bg-muted/30 px-6 py-24" bind:this={inView.ref} id="pricing">
    <div class="mx-auto max-w-6xl">
        <div
            class="mb-16 text-center transition-all duration-700"
            style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView ? 0 : 20}px);"
        >
            <Badge class="mb-4" variant="outline">Pricing</Badge>
            <h2 class="mb-4 text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
            <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
                Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>
        </div>

        <div class="grid gap-2 md:grid-cols-3 lg:gap-4">
            {#each PRICING_TIERS as tier, i (tier.name)}
                {@render pricing_tier({ position: i, tier })}
            {/each}
        </div>
    </div>
</section>

{#snippet pricing_tier({ position, tier }: PricinTierProps)}
    <div
        class={cn('relative flex flex-col rounded-xl bg-accent transition-all duration-500', tier.popular && 'bg-primary lg:scale-105')}
        style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView ? 0 : 30}px); transition-delay: {(position + 1) * 50}ms;"
    >
        <h3 class="pt-2 pb-1.5 pl-3 text-sm font-semibold uppercase" class:text-primary-foreground={tier.popular}>
            {tier.name}
        </h3>

        <div class={cn('flex flex-1 flex-col gap-4 border rounded-xl bg-card px-4 py-3', tier.popular && 'border-primary')}>
            <div>
                <p class="text-sm text-muted-foreground">{tier.description}</p>
                <span class="text-4xl font-bold">{tier.price}</span>
                <span class="text-muted-foreground">/month</span>
                {#if tier.priceNote}
                    <p class="text-xs text-muted-foreground">{tier.priceNote}</p>
                {:else}
                    <div class="size-4"></div>
                {/if}
            </div>

            <ul class="mb-1 flex-1 space-y-2">
                {#each tier.features as feature (feature)}
                    <li class="flex items-start gap-3 text-sm">
                        <CheckIcon class="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                    </li>
                {/each}
            </ul>

            <Button
                class="mt-auto w-full"
                href={ROUTES.auth.signup}
                variant={tier.ctaVariant}
            >
                {tier.cta}
            </Button>
        </div>
    </div>
{/snippet}
