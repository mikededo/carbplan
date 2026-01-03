<script lang="ts">
    import './root.css'

    import { onMount } from 'svelte'

    import { invalidate } from '$app/navigation'

    const { children, data } = $props()
    const { session, supabase } = $derived(data)

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at === session?.expires_at) {
                return
            }

            invalidate('supabase:auth')
        })

        return () => {
            data.subscription.unsubscribe()
        }
    })
</script>

<svelte:head>
    <title>CarbPlan</title>
</svelte:head>

{@render children()}
