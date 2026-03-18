<script lang="ts">
    import { ArrowRightIcon, ChevronRightIcon } from '@lucide/svelte'

    import { Badge } from '$lib/domain/ui/badge'
    import { Button } from '$lib/domain/ui/button'
    import { InView } from '$lib/hooks/in-view.svelte'
    import { cn } from '$lib/utils'

    import { PRODUCT_SHOWCASES } from '../constants'
    import ProductVisualization from './product-visualization/product-visualization.svelte'

    type Props = {
        type: 'dashboard' | 'planner' | 'supplements'
        class?: string
        reverse?: boolean
    }
    const { class: className = '', reverse = false, type }: Props = $props()

    const inView = new InView({ threshold: 0.3 })

    const data = $derived(PRODUCT_SHOWCASES[type])
</script>

<section
    class={cn('px-6 py-24', className)}
    bind:this={inView.ref}
    id={type === 'dashboard' ? 'product' : undefined}
>
    <div class="mx-auto max-w-6xl">
        <div class="grid items-center gap-12 lg:grid-cols-2">
            <div class:lg:order-2={reverse}>
                <div class="space-y-6">
                    <Badge variant="outline">{data.badge}</Badge>
                    <h2 class="text-3xl font-bold md:text-4xl">{data.title}</h2>
                    <p class="text-lg text-muted-foreground">{data.description}</p>
                    <ul class="space-y-3">
                        {#each data.bullets as bullet (bullet)}
                            <li class="flex items-center gap-3 text-sm">
                                <div
                                    class="flex size-5 items-center justify-center rounded-full bg-primary/10"
                                >
                                    <ChevronRightIcon class="size-3 text-primary" />
                                </div>
                                {bullet}
                            </li>
                        {/each}
                    </ul>
                    <Button class="mt-4" href={data.ctaHref}>
                        {data.ctaText}
                        <ArrowRightIcon class="ml-2 size-4" />
                    </Button>
                </div>
            </div>

            <div class:lg:order-1={reverse} class:lg:pl-8={!reverse} class:lg:pr-8={reverse}>
                <ProductVisualization isVisible={inView.isInView} {type} />
            </div>
        </div>
    </div>
</section>
