<script lang="ts">
    import LandingCta from '$lib/domain/marketing/components/landing-cta.svelte'
    import LandingFeatures from '$lib/domain/marketing/components/landing-features.svelte'
    import LandingHero from '$lib/domain/marketing/components/landing-hero.svelte'
    import LandingPricing from '$lib/domain/marketing/components/landing-pricing.svelte'
    import LandingProductShowcase from '$lib/domain/marketing/components/landing-product-showcase.svelte'
    import LandingStats from '$lib/domain/marketing/components/landing-stats.svelte'
</script>

<LandingHero />

<LandingFeatures />

<LandingProductShowcase type="dashboard" />

<LandingProductShowcase class="bg-muted/30" type="planner" reverse />

<LandingProductShowcase type="supplements" />

<LandingStats />

<LandingPricing />

<LandingCta />
