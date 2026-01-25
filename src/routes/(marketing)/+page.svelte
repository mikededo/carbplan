<script lang="ts">
    import LandingCta from '$lib/domain/marketing/components/landing-cta.svelte'
    import LandingFeatures from '$lib/domain/marketing/components/landing-features.svelte'
    import LandingFooter from '$lib/domain/marketing/components/landing-footer.svelte'
    import LandingHero from '$lib/domain/marketing/components/landing-hero.svelte'
    import LandingNav from '$lib/domain/marketing/components/landing-nav.svelte'
    import LandingPricing from '$lib/domain/marketing/components/landing-pricing.svelte'
    import LandingProductShowcase from '$lib/domain/marketing/components/landing-product-showcase.svelte'
    import LandingStats from '$lib/domain/marketing/components/landing-stats.svelte'
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
