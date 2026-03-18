<script lang="ts">
    import type { ActionData } from './$types'

    import { enhance } from '$app/forms'
    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/domain/ui/card'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'

    type Props = { form: ActionData }
    const { form }: Props = $props()
</script>

<svelte:head>
    <title>Log In — CarbPlan</title>
</svelte:head>

<Card class="w-full max-w-md">
    <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Welcome back! Enter your credentials to continue</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
        <form class="flex flex-col gap-4" use:enhance method="POST">

            <div class="flex flex-col gap-1.5">
                <Label for="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form?.values?.email ?? ''}
                    required
                    aria-invalid={form?.errors?.email ? 'true' : 'false'}
                />
                {#if form?.errors?.email}
                    <p class="text-sm text-destructive">{form.errors.email}</p>
                {/if}
            </div>

            <div class="flex flex-col gap-1.5">
                <Label for="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    aria-invalid={form?.errors?.password ? 'true' : 'false'}
                />
                {#if form?.errors?.password}
                    <p class="text-sm text-destructive">{form.errors?.password}</p>
                {/if}
            </div>

            {#if form?.message}
                <p class="text-sm text-destructive">{form.message}</p>
            {/if}
            <Button class="mt-2" type="submit">Log in</Button>
        </form>

        <p class="text-center text-sm">
            Don't have an account?
            <a class="text-primary hover:underline" href={ROUTES.auth.signup}>Sign up</a>
        </p>
    </CardContent>
</Card>
