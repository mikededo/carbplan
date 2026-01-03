<script lang="ts">
    import type { ActionData } from './$types'

    import { enhance } from '$app/forms'
    import { Button } from '$lib/components/ui/button'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card'
    import { Input } from '$lib/components/ui/input'
    import { Label } from '$lib/components/ui/label'
    import { ROUTES } from '$lib/constants/routes'

    type Props = { form: ActionData }
    const { form }: Props = $props()
</script>

<Card class="w-full max-w-md">
    <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
    </CardHeader>
    <CardContent>
        <form class="flex flex-col gap-4" use:enhance method="POST">
            {#if form?.message}
                <p class="text-sm text-destructive">{form.message}</p>
            {/if}

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

            <Button class="mt-2" type="submit">Sign up</Button>

            <p class="text-sm">
                Already with an account?
                <a href={ROUTES.auth.login}>Log in</a>
            </p>
        </form>
    </CardContent>
</Card>
