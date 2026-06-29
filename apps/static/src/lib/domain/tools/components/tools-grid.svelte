<script lang="ts">
    import type { Tool } from '$lib/domain/tools/tools'

    import { InView } from '$lib/hooks/in-view.svelte'

    import { entryStyles } from '../../marketing/helpers'
    import { TOOL_CATEGORIES } from '../tools'
    import ToolCard from './tool-card.svelte'

    type Props = {
        tools: Tool[]
    }
    const { tools }: Props = $props()

    const groups = $derived(
        TOOL_CATEGORIES.map((category) => ({
            category,
            tools: tools.filter((tool) => tool.category === category)
        })).filter((group) => group.tools.length > 0)
    )

    const inView = new InView({ threshold: 0.1 })
</script>

<section bind:this={inView.ref} id="tools">
    <div class="space-y-16">
        {#each groups as group, groupIndex (group.category)}
            <div>
                <h2
                    class="text-2xl font-medium tracking-tight transition-all duration-500"
                    style={entryStyles(inView.isInView, { delay: groupIndex * 100 })}
                >
                    {group.category}
                </h2>

                <div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each group.tools as tool, i (tool.id)}
                        <div
                            class="transition-all duration-500"
                            style={entryStyles(inView.isInView, { delay: groupIndex * 100 + i * 60, offset: 30 })}
                        >
                            <ToolCard {tool} />
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</section>
