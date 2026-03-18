<script lang="ts">
    import type { LayoutProps } from './$types'

    const { children }: LayoutProps = $props()
</script>

<main class="flex h-screen w-full items-center justify-center bg-muted">
    {@render children()}
</main>
