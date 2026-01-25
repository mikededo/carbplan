<script lang="ts">
    import { ArrowRightIcon, PlayIcon, ZapIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Badge } from '$lib/domain/ui/badge'
    import { Button } from '$lib/domain/ui/button'
    import { InView } from '$lib/hooks/in-view.svelte'

    import { HERO_FEATURES } from '../constants'
    import HeroProductVisualization from './product-visualization/hero-product-visualization.svelte'

    const inView = new InView({ threshold: 0.1 })
</script>

<section class="overflow-hidden px-6 pt-32 pb-24" bind:this={inView.ref}>
    <div class="mx-auto max-w-6xl">
        <div class="grid items-center gap-12 lg:grid-cols-2">
            <!-- Left column - Copy -->
            <div class="space-y-8">
                <div class="space-y-4">
                    <Badge class="px-4 py-1.5" variant="secondary">
                        <ZapIcon class="mr-2 size-3" />
                        Built for endurance athletes
                    </Badge>
                    <h1
                        class="text-4xl font-bold tracking-tight transition-all duration-700 md:text-5xl lg:text-6xl"
                        style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView
                            ? 0
                            : 20}px);"
                    >
                        <span class="text-balance">
                            Plan your <span class="text-primary">race-day nutrition</span> with precision
                        </span>
                    </h1>
                </div>

                <p
                    class="text-lg leading-relaxed text-muted-foreground transition-all delay-100 duration-700"
                    style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView
                        ? 0
                        : 20}px);"
                >
                    CarbPlan helps you create detailed nutrition strategies before every workout. Calculate
                    exact carb and calorie needs based on your planned duration, power targets, and personal
                    physiology. Review historical data to refine your approach over time.
                </p>

                <div
                    class="grid grid-cols-2 gap-4 transition-all delay-200 duration-700"
                    style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView
                        ? 0
                        : 20}px);"
                >
                    {#each HERO_FEATURES as feature (feature.label)}
                        <div class="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                            <div
                                class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                            >
                                <feature.icon class="size-4 text-primary" />
                            </div>
                            <div>
                                <p class="text-sm font-medium">{feature.label}</p>
                                <p class="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    {/each}
                </div>

                <div
                    class="flex flex-col items-start gap-4 pt-2 transition-all delay-300 duration-700 sm:flex-row"
                    style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView
                        ? 0
                        : 20}px);"
                >
                    <Button class="px-8" href={ROUTES.auth.signup} size="lg">
                        Start Free Trial
                        <ArrowRightIcon class="ml-2 size-4" />
                    </Button>
                    <Button class="bg-transparent px-8" size="lg" variant="outline">
                        <PlayIcon class="mr-2 size-4" />
                        Watch Demo
                    </Button>
                </div>

            </div>

            <div
                class="relative transition-all duration-1000 lg:pl-8"
                style="opacity: {inView.isInView ? 1 : 0}; transform: translateX({inView.isInView ? 0 : 40}px);"
            >
                <HeroProductVisualization isVisible={inView.isInView} />
            </div>
        </div>
    </div>
</section>
