<script lang="ts">
    import './root.css'

    import { onMount } from 'svelte'

    import { setAuthContext } from '$lib/domain/auth/context'
    import QueryProvider from '$lib/domain/query/provider.svelte'
    import { createPublicServicesContext } from '$lib/domain/services/context.js'
    import { createThemeContext } from '$lib/domain/theme'

    const { children, data } = $props()
    const { queryClient } = $derived(data)

    const theme = createThemeContext()

    setAuthContext(() => data.user ?? null)
    createPublicServicesContext(() => data.publicServices)

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
