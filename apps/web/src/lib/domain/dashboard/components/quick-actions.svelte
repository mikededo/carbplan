<script lang="ts">
    import { Button } from '@kilo/ui/button'
    import { CardDescription, CardFooter, CardHeader, CardRoot, CardTitle } from '@kilo/ui/card'
    import { PillIcon, Plus } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
</script>

<section class="grid gap-4 md:grid-cols-2">
    <CardRoot class="gap-3 rounded-md py-4">
        <CardHeader class="px-4 pb-0">
            <CardTitle class="text-base font-medium">Start a new plan</CardTitle>
            <CardDescription>Build a fueling strategy for your next session</CardDescription>
        </CardHeader>
        <CardFooter class="px-4 pt-0">
            <Button class="gap-2" href={ROUTES.plans.new} size="sm">
                <Plus class="size-4" />
                New plan
            </Button>
        </CardFooter>
    </CardRoot>

    <CardRoot class="gap-3 rounded-md py-4">
        <CardHeader class="px-4 pb-0">
            <CardTitle class="text-base font-medium">Browse supplements</CardTitle>
            <CardDescription>Find products to add to your plans</CardDescription>
        </CardHeader>
        <CardFooter class="px-4 pt-0">
            <Button class="gap-2"
                href={ROUTES.admin.supplements}
                size="sm"
                variant="outline"
            >
                <PillIcon class="size-4" />
                View catalog
            </Button>
        </CardFooter>
    </CardRoot>
</section>
