<script lang="ts">
    import { PillIcon, Plus } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import Button from '$lib/domain/ui/button/button.svelte'
    import CardDescription from '$lib/domain/ui/card/card-description.svelte'
    import CardFooter from '$lib/domain/ui/card/card-footer.svelte'
    import CardHeader from '$lib/domain/ui/card/card-header.svelte'
    import CardTitle from '$lib/domain/ui/card/card-title.svelte'
    import CardRoot from '$lib/domain/ui/card/card.svelte'
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
