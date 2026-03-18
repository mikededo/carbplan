<script lang="ts">
    import type { QueryClient } from '@tanstack/svelte-query'
    import type { Snippet } from 'svelte'

    import { QueryClientProvider } from '@tanstack/svelte-query'
    import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'

    import { dev } from '$app/environment'

    type Props = {
        children: Snippet
        queryClient: QueryClient
    }
    const { children, queryClient }: Props = $props()
</script>

<QueryClientProvider client={queryClient}>
    {@render children()}
    {#if dev}
        <SvelteQueryDevtools />
    {/if}
</QueryClientProvider>

