<script lang="ts">
    import type { Snippet } from 'svelte'

    type Props = { children: Snippet }
    const { children }: Props = $props()
</script>

<div class="@container/page-content h-[calc(100dvh---spacing(16))] w-full overflow-y-auto">
    <div class="flex flex-col gap-6 p-6">
        {@render children()}
    </div>
</div>
