<script lang="ts">
    import { InView } from '$lib/hooks/in-view.svelte'

    import { STATS } from '../constants'
    import AnimatedCounter from './animated-counter.svelte'

    const inView = new InView({ threshold: 0.3 })
</script>

<section class="bg-primary px-6 py-24 text-primary-foreground" bind:this={inView.ref}>
    <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 text-center md:grid-cols-4">
            {#each STATS as stat, i (stat.label)}
                <div
                    class="transition-all duration-500"
                    style="opacity: {inView.isInView ? 1 : 0}; transform: translateY({inView.isInView
                        ? 0
                        : 20}px); transition-delay: {i * 100}ms;"
                >
                    <p class="mb-2 text-4xl font-bold md:text-5xl">
                        <AnimatedCounter suffix={stat.suffix} value={stat.value} />
                    </p>
                    <p class="text-primary-foreground/80">{stat.label}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
