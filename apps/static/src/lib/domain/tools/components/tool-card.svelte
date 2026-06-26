<script lang="ts">
    import type { Tool } from '$lib/domain/tools/tools'

    import { Button } from '@kilo/ui/button'
    import { ArrowRightIcon } from '@lucide/svelte'

    type Props = {
        tool: Tool
    }
    const { tool }: Props = $props()

    const available = $derived(Boolean(tool.href))
</script>

<article
    class="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors"
    class:hover:border-primary={available}
>
    <div class="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
        <tool.icon class="size-5 text-primary" />
    </div>

    <h3 class="font-semibold tracking-tight">{tool.title}</h3>
    <p class="mt-2 flex-1 text-sm/6 text-muted-foreground">
        {tool.description}
    </p>

    {#if available}
        <div class="mt-6 flex items-center justify-between gap-3">
            <span class="text-xs font-medium text-muted-foreground">Free · no account</span>
            <Button href={tool.href ?? undefined} size="sm" variant="outline">
                Open tool
                <ArrowRightIcon class="ml-2 size-4" />
            </Button>
        </div>
    {:else}
        <p class="mt-6 text-xs font-medium text-muted-foreground">Coming soon</p>
    {/if}
</article>
