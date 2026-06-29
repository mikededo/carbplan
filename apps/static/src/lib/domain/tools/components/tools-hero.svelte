<script lang="ts">
    import { Badge } from '@kilo/ui/badge'
    import { Button } from '@kilo/ui/button'
    import { ArrowRightIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { m } from '$lib/domain/i18n/messages.js'
    import { entryStyles } from '$lib/domain/marketing/helpers'
    import GearRatioPreview from '$lib/domain/tools/components/gear-ratio-preview.svelte'
    import { InView } from '$lib/hooks/in-view.svelte'

    const inView = new InView({ threshold: 0.1 })
</script>

<section bind:this={inView.ref}>
    <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-8">
            <Badge class="w-fit" variant="secondary">{m.tools_hero_badge()}</Badge>

            <div class="space-y-4">
                <h1
                    class="max-w-2xl text-4xl font-bold tracking-tight text-balance transition-all duration-700 md:text-6xl"
                    style={entryStyles(inView.isInView)}
                >
                    {m.tools_hero_heading()}
                </h1>
                <p
                    class="max-w-xl text-lg text-muted-foreground transition-all delay-100 duration-700"
                    style={entryStyles(inView.isInView)}
                >
                    {m.tools_hero_body()}
                </p>
            </div>

            <div
                class="flex flex-col items-start gap-4 transition-all delay-200 duration-700 sm:flex-row"
                style={entryStyles(inView.isInView)}
            >
                <Button
                    href={ROUTES.auth.signup}
                    size="lg"
                >
                    {m.tools_hero_cta()}
                    <ArrowRightIcon class="ml-2 size-4" />
                </Button>
            </div>
        </div>

        <div
            class="transition-all duration-1000 lg:pl-4"
            style={entryStyles(inView.isInView, { offset: 40, transform: 'translateX' })}
        >
            <GearRatioPreview isVisible={inView.isInView} />
        </div>
    </div>
</section>
