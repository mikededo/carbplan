<script lang="ts">
    import { PillIcon, Plus } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import * as Card from '$lib/domain/ui/card'
</script>

<section class="grid gap-4 md:grid-cols-2">
    <Card.Root class="gap-3 rounded-md py-4">
        <Card.Header class="px-4 pb-0">
            <Card.Title class="text-base font-medium">Start a new plan</Card.Title>
            <Card.Description>Build a fueling strategy for your next session</Card.Description>
        </Card.Header>
        <Card.Footer class="px-4 pt-0">
            <Button class="gap-2" href={ROUTES.plans.new} size="sm">
                <Plus class="size-4" />
                New plan
            </Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root class="gap-3 rounded-md py-4">
        <Card.Header class="px-4 pb-0">
            <Card.Title class="text-base font-medium">Browse supplements</Card.Title>
            <Card.Description>Find products to add to your plans</Card.Description>
        </Card.Header>
        <Card.Footer class="px-4 pt-0">
            <Button class="gap-2"
                href={ROUTES.admin.supplements}
                size="sm"
                variant="outline"
            >
                <PillIcon class="size-4" />
                View catalog
            </Button>
        </Card.Footer>
    </Card.Root>
</section>
