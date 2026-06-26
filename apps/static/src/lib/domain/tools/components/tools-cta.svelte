<script lang="ts">
    import { Button } from '@kilo/ui/button'
    import { ArrowRightIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { InView } from '$lib/hooks/in-view.svelte'

    import { entryStyles } from '../../marketing/helpers'

    const inView = new InView({ threshold: 0.3 })
</script>

<section class="bg-muted/30 px-6 py-24" bind:this={inView.ref}>
    <div class="mx-auto max-w-3xl space-y-6 text-center">
        <h2
            class="text-3xl font-bold transition-all duration-700 md:text-4xl"
            style={entryStyles(inView.isInView)}
        >
            Outgrown the calculators?
        </h2>
        <p
            class="text-lg text-muted-foreground transition-all delay-100 duration-700"
            style={entryStyles(inView.isInView)}
        >
            Kilo turns these numbers into a full nutrition plan for every workout, then tracks how it
            played out. Start free, no credit card required.
        </p>
        <div
            class="flex justify-center pt-4 transition-all delay-200 duration-700"
            style={entryStyles(inView.isInView)}
        >
            <Button class="px-8" href={ROUTES.auth.signup} size="lg">
                Start Free Trial
                <ArrowRightIcon class="ml-2 size-4" />
            </Button>
        </div>
    </div>
</section>
