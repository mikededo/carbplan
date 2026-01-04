<script lang="ts">
    import { LogInIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import { Logo } from '$lib/domain/ui/logo'
</script>

<svelte:head>
    <title>CarbPlan — Athlete Nutrition Planning</title>
    <meta content="Plan your nutrition for every workout. Build custom fueling strategies based on your power, duration, and personal tolerance." name="description" />
</svelte:head>

<div class="min-h-screen bg-linear-to-b from-background to-muted/30">
    <header class="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <nav class="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
            <a class="flex items-center gap-1 font-semibold tracking-tight" href={ROUTES.landing}>
                <Logo class="size-6" />
                <span>CarbPlan</span>
            </a>

            <Button href={ROUTES.auth.login} size="sm">
                Log in
                <LogInIcon />
            </Button>
        </nav>
    </header>

    <main class="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div class="max-w-2xl text-center">
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
                Fuel your rides with
                <span class="text-primary">precision</span>
            </h1>
            <p class="mt-6 text-lg text-muted-foreground">
                Plan your nutrition for every workout. Build custom fueling strategies based on your power,
                duration, and personal tolerance.
            </p>
            <div class="mt-10 flex items-center justify-center gap-4">
                <Button href={ROUTES.auth.signup} size="lg">
                    Get started
                </Button>
                <Button href={ROUTES.auth.login} size="lg" variant="ghost">
                    I have an account
                </Button>
            </div>
        </div>
    </main>
</div>
