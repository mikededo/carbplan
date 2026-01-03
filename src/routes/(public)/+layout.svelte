<script lang="ts">
    import type { LayoutProps } from './$types'

    import { sineOut } from 'svelte/easing'
    import { fade } from 'svelte/transition'

    const { children, data }: LayoutProps = $props()
</script>

{#key data.pathname}
    <main
        class="flex h-screen items-center justify-center overflow-y-hidden bg-muted"
        in:fade={{ duration: 150, easing: sineOut }}
    >
        {@render children()}
    </main>
{/key}
