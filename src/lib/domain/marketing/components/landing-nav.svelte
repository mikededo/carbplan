<script lang="ts">
    import { createBrowserClient } from '@supabase/ssr'
    import { onMount } from 'svelte'

    import { browser } from '$app/environment'
    import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import { Logo } from '$lib/domain/ui/logo'

    let isLoggedIn = $state(false)

    onMount(async () => {
        if (!browser) {
            return
        }

        const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY)
        const { data } = await supabase.auth.getSession()
        isLoggedIn = !!data.session?.user
    })
</script>

<nav class="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a class="flex items-center gap-2" href={ROUTES.landing}>
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Logo class="size-5 text-primary-foreground" />
            </div>
            <span class="text-lg font-bold">CarbPlan</span>
        </a>

        <div class="hidden items-center gap-8 md:flex">
            <a
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href="#features"
            >
                Features
            </a>
            <a
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href="#product"
            >
                Product
            </a>
            <a
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href="#pricing"
            >
                Pricing
            </a>
        </div>

        <div class="flex items-center gap-3">
            {#if isLoggedIn}
                <Button href={ROUTES.dashboard} size="sm">Go to app</Button>
            {:else}
                <Button href={ROUTES.auth.login} size="sm" variant="ghost">Log in</Button>
                <Button href={ROUTES.auth.signup} size="sm">Get Started</Button>
            {/if}
        </div>
    </div>
</nav>
