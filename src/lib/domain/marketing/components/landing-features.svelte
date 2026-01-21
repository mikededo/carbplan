<script lang="ts">
    import { InView } from '$lib/hooks/in-view.svelte'

    import { FEATURES } from '../constants'

    const inView = new InView({ threshold: 0.2 })
</script>

<section class="bg-muted/30 px-6 py-24" bind:this={inView.ref} id="features">
    <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
            <h2 class="mb-4 text-3xl font-bold md:text-4xl">Everything you need to fuel right</h2>
            <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
                From workout analysis to supplement tracking, CarbPlan gives you complete control over your
                nutrition strategy.
            </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each FEATURES as feature, i (feature.title)}
                <div
                    class="rounded-xl border border-border bg-card p-6 transition-all duration-500"
                    style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView
                        ? 0
                        : 20}px); transition-delay: {i * 100}ms;"
                >
                    <div class="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon class="size-5 text-primary" />
                    </div>
                    <h3 class="mb-2 font-semibold">{feature.title}</h3>
                    <p class="text-sm text-muted-foreground">{feature.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
