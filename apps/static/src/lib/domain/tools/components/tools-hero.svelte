<script lang="ts">
    import { Badge } from '@kilo/ui/badge'
    import { Button } from '@kilo/ui/button'
    import { ArrowRightIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { InView } from '$lib/hooks/in-view.svelte'

    import { entryStyles } from '../../marketing/helpers'
    import GearRatioPreview from './gear-ratio-preview.svelte'

    const inView = new InView({ threshold: 0.1 })
</script>

<section bind:this={inView.ref}>
    <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-8">
            <Badge class="w-fit" variant="secondary">Free cycling tools</Badge>

            <div class="space-y-4">
                <h1
                    class="max-w-2xl text-4xl font-bold tracking-tight text-balance transition-all duration-700 md:text-6xl"
                    style={entryStyles(inView.isInView)}
                >
                    Cycling tools that are useful before you sign up.
                </h1>
                <p
                    class="max-w-xl text-lg text-muted-foreground transition-all delay-100 duration-700 md:text-xl"
                    style={entryStyles(inView.isInView)}
                >
                    Free calculators for gearing, tire pressure, and fueling. When a ride needs a full
                    nutrition plan, Kilo takes over.
                </p>
            </div>

            <div
                class="flex flex-col items-start gap-4 transition-all delay-200 duration-700 sm:flex-row"
                style={entryStyles(inView.isInView)}
            >
                <Button class="px-8" href="#tools" size="lg">Browse tools</Button>
                <Button class="bg-transparent px-8"
                    href={ROUTES.auth.signup}
                    size="lg"
                    variant="outline"
                >
                    Start with Kilo
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
