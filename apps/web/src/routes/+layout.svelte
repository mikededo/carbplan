<script lang="ts">
    import './root.css'

    import { onMount } from 'svelte'

    import { invalidate } from '$app/navigation'
    import { setSupabaseClient } from '$lib/database/context'
    import { setAuthContext } from '$lib/domain/auth/context'
    import QueryProvider from '$lib/domain/query/provider.svelte'
    import { createThemeContext } from '$lib/domain/theme'

    const { children, data } = $props()
    const { queryClient, session, supabase } = $derived(data)

    const theme = createThemeContext()

    setSupabaseClient(() => supabase)
    setAuthContext(() => data.session?.user ?? null)

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at === session?.expires_at) {
                return
            }

            invalidate('supabase:auth')
        })

        const cleanupThemeListener = theme.setupSystemListener()

        return () => {
            data.subscription.unsubscribe()
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
