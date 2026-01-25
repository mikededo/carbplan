<script lang="ts">
    import { ArrowRightIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import { InView } from '$lib/hooks/in-view.svelte'

    import { entryStyles } from '../helpers'

    const inView = new InView({ threshold: 0.3 })
</script>

<section class="px-6 py-24" bind:this={inView.ref}>
    <div class="mx-auto max-w-3xl space-y-6 text-center">
        <h2
            class="text-3xl font-bold transition-all duration-700 md:text-4xl"
            style={entryStyles(inView.isInView)}
        >
            Ready to optimize your nutrition?
        </h2>

        <p
            class="text-lg text-muted-foreground transition-all delay-100 duration-700"
            style={entryStyles(inView.isInView)}
        >
            Fuel smarter with CarbPlan. Start your free trial today, no credit card required.
        </p>

        <div
            class="flex flex-col items-center justify-center gap-4 pt-4 transition-all delay-200 duration-700 sm:flex-row"
            style={entryStyles(inView.isInView)}
        >
            <Button class="px-8" href={ROUTES.auth.signup} size="lg">
                Start Free Trial
                <ArrowRightIcon class="ml-2 size-4" />
            </Button>
            <Button class="bg-transparent px-8" size="lg" variant="outline">Contact Sales</Button>
        </div>
    </div>
</section>
