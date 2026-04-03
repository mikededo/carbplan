<script lang="ts">
    import './root.css'

    import { onMount } from 'svelte'

    import { setAuthContext } from '$lib/domain/auth/context'
    import QueryProvider from '$lib/domain/query/provider.svelte'
    import { createThemeContext } from '$lib/domain/theme'

    const { children, data } = $props()
    const { queryClient } = $derived(data)

    const theme = createThemeContext()

    setAuthContext(() => data.session?.user ?? null)

    onMount(() => {
        const cleanupThemeListener = theme.setupSystemListener()

        return () => {
            cleanupThemeListener()
        }
    })
</script>

<svelte:head>
    <title>CarbPlan</title>
</svelte:head>

<QueryProvider {queryClient}>
    {@render children()}
</QueryProvider>
