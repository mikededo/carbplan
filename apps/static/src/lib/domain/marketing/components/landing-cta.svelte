<script lang="ts">
    import { Button } from '@kilo/ui/button'
    import { ArrowRightIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { m } from '$lib/domain/i18n/messages.js'
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
            {m.landing_cta_heading()}
        </h2>

        <p
            class="text-lg text-muted-foreground transition-all delay-100 duration-700"
            style={entryStyles(inView.isInView)}
        >
            {m.landing_cta_body()}
        </p>

        <div
            class="flex flex-col items-center justify-center gap-4 pt-4 transition-all delay-200 duration-700 sm:flex-row"
            style={entryStyles(inView.isInView)}
        >
            <Button class="px-8" href={ROUTES.auth.signup} size="lg">
                {m.cta_start_free_trial()}
                <ArrowRightIcon class="ml-2 size-4" />
            </Button>
            <Button class="bg-transparent px-8" size="lg" variant="outline">{m.cta_contact_sales()}</Button>
        </div>
    </div>
</section>
