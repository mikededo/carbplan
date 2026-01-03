<script lang="ts">
    import './root.css'

    import { onMount } from 'svelte'

    import { invalidate } from '$app/navigation'
    import { createThemeContext } from '$lib/domain/theme'

    const { children, data } = $props()
    const { session, supabase } = $derived(data)

    const theme = createThemeContext()

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

{@render children()}
