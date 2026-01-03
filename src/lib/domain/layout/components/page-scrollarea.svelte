<script lang="ts">
    import type { Snippet } from 'svelte'

    type Props = { children: Snippet }
    const { children }: Props = $props()
</script>

<div class="@container/page-content h-[calc(100dvh-calc(var(--spacing)*16))] w-full overflow-y-auto">
    {@render children()}
</div>
