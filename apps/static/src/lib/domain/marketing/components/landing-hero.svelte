<script lang="ts">
    import { Badge } from '@kilo/ui/badge'
    import { Button } from '@kilo/ui/button'
    import { ArrowRightIcon, PlayIcon, ZapIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { m } from '$lib/domain/i18n/messages.js'
    import { InView } from '$lib/hooks/in-view.svelte'

    import { HERO_FEATURES } from '../constants'
    import { entryStyles } from '../helpers'
    import HeroProductVisualization from './product-visualization/hero-product-visualization.svelte'

    const inView = new InView({ threshold: 0.1 })
</script>

<section class="overflow-hidden px-6 pt-32 pb-24" bind:this={inView.ref}>
    <div class="mx-auto max-w-6xl">
        <div class="grid items-center gap-12 lg:grid-cols-2">
            <div class="space-y-8">
                <div class="space-y-4">
                    <Badge class="px-4 py-1.5" variant="secondary">
                        <ZapIcon class="mr-2 size-3" />
                        {m.landing_hero_badge()}
                    </Badge>
                    <h1
                        class="text-4xl font-bold tracking-tight transition-all duration-700 md:text-5xl lg:text-6xl"
                        style={entryStyles(inView.isInView)}
                    >
                        <span class="text-balance">
                            {m.landing_hero_headline_prefix()} <span class="text-primary">{m.landing_hero_headline_emphasis()}</span> {m.landing_hero_headline_suffix()}
                        </span>
                    </h1>
                </div>

                <p
                    class="text-lg/relaxed text-muted-foreground transition-all delay-100 duration-700"
                    style={entryStyles(inView.isInView)}
                >
                    {m.landing_hero_body()}
                </p>

                <div
                    class="grid grid-cols-2 gap-4 transition-all delay-200 duration-700"
                    style={entryStyles(inView.isInView)}
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
                    style={entryStyles(inView.isInView)}
                >
                    <Button class="px-8" href={ROUTES.auth.signup} size="lg">
                        {m.cta_start_free_trial()}
                        <ArrowRightIcon class="ml-2 size-4" />
                    </Button>
                    <Button class="bg-transparent px-8" size="lg" variant="outline">
                        <PlayIcon class="mr-2 size-4" />
                        {m.cta_watch_demo()}
                    </Button>
                </div>

            </div>

            <div
                class="relative transition-all duration-1000 lg:pl-8"
                style={entryStyles(inView.isInView, { offset: 40, transform: 'translateX' })}
            >
                <HeroProductVisualization isVisible={inView.isInView} />
            </div>
        </div>
    </div>
</section>
