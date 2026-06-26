<script lang="ts">
    import { Button } from '@kilo/ui/button'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kilo/ui/card'
    import { Input } from '@kilo/ui/input'
    import { Label } from '@kilo/ui/label'

    import { goto } from '$app/navigation'
    import { resolve } from '$app/paths'
    import { ROUTES } from '$lib/constants/routes'
    import { authClient } from '$lib/domain/auth/client'

    let email = $state('')
    let errors = $state<{ email?: string, password?: string }>({})
    let message = $state<string>()
    let pending = $state(false)

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault()
        pending = true
        errors = {}
        message = undefined

        const formData = new FormData(event.currentTarget as HTMLFormElement)
        email = formData.get('email')?.toString() ?? ''
        const password = formData.get('password')?.toString() ?? ''

        if (!email.includes('@') || password.length < 8) {
            errors = {
                email: email.includes('@') ? undefined : 'Invalid email address',
                password: password.length >= 8 ? undefined : 'Password must be at least 8 characters'
            }
            pending = false
            return
        }

        const callbackURL = resolve(ROUTES.onboarding)
        const response = await authClient.signUp.email({ callbackURL, email, name: email, password })
        pending = false

        if (response.error) {
            message = response.error.message ?? 'Unable to sign up'
            return
        }

        await goto(callbackURL)
    }
</script>

<svelte:head>
    <title>Sign Up — Kilo</title>
</svelte:head>

<Card class="w-full max-w-md">
    <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
        <form class="flex flex-col gap-4" method="POST" onsubmit={onSubmit}>
            {#if message}
                <p class="text-sm text-destructive">{message}</p>
            {/if}

            <div class="flex flex-col gap-1.5">
                <Label for="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    required
                    aria-invalid={errors.email ? 'true' : 'false'}
                />
                {#if errors.email}
                    <p class="text-sm text-destructive">{errors.email}</p>
                {/if}
            </div>

            <div class="flex flex-col gap-1.5">
                <Label for="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    aria-invalid={errors.password ? 'true' : 'false'}
                />
                {#if errors.password}
                    <p class="text-sm text-destructive">{errors.password}</p>
                {/if}
            </div>

            <Button class="mt-2" disabled={pending} type="submit">Sign up</Button>
        </form>

        <p class="text-center text-sm">
            Already with an account?
            <a class="text-primary hover:underline" href={resolve(ROUTES.auth.signin)}>Log in</a>
        </p>
    </CardContent>
</Card>
