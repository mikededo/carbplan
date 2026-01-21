<script lang="ts">
    import {
        LandingCta,
        LandingFeatures,
        LandingFooter,
        LandingHero,
        LandingNav,
        LandingPricing,
        LandingProductShowcase,
        LandingStats
    } from '$lib/domain/marketing/components'
</script>

<svelte:head>
    <title>CarbPlan — Athlete Nutrition Planning</title>
    <meta
        content="Plan your nutrition for every workout. Build custom fueling strategies based on your power, duration, and personal tolerance."
        name="description"
    />
</svelte:head>

<div class="min-h-screen bg-background">
    <LandingNav />

    <LandingHero />

    <LandingFeatures />

    <LandingProductShowcase type="dashboard" />

    <LandingProductShowcase class="bg-muted/30" type="planner" reverse />

    <LandingProductShowcase type="supplements" />

    <LandingStats />

    <LandingPricing />

    <LandingCta />

    <LandingFooter />
</div>
