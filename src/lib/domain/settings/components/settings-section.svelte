<script lang="ts">
    import type { Snippet } from 'svelte'

    type Props = {
        children: Snippet
        title: string
        description: string
    }
    const { children, description, title }: Props = $props()
</script>

<section class="grid gap-x-8 gap-y-4 py-6 @5xl/page-content:grid-cols-3">
    <header class="space-y-1">
        <h3 class="font-medium">{title}</h3>
        <p class="text-sm text-muted-foreground">{description}</p>
    </header>
    <div class="grid gap-4 md:col-span-2">
        {@render children()}
    </div>
</section>

