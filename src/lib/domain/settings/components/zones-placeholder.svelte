<script lang="ts">
    import type { Component } from 'svelte'

    type Props = {
        title: string
        description: string
        icon: Component
    }
    const { description, icon: Icon, title }: Props = $props()
</script>

<div class="flex items-center gap-4 rounded-lg border border-dashed p-4">
    <div class="flex size-10 items-center justify-center rounded-full bg-muted">
        <Icon class="size-5 text-muted-foreground" />
    </div>
    <div class="space-y-0.5">
        <p class="text-sm font-medium">{title}</p>
        <p class="text-xs text-muted-foreground">{description}</p>
    </div>
</div>

