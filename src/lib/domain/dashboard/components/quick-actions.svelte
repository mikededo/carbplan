<script lang="ts">
    import { Plus, Search } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { Button } from '$lib/domain/ui/button'
    import * as Card from '$lib/domain/ui/card'
</script>

<section class="grid gap-4 md:grid-cols-2">
    <Card.Root class="gap-3 rounded-md py-4">
        <Card.Header class="px-4 pb-0">
            <Card.Title class="text-base font-medium">Create plan</Card.Title>
            <Card.Description>Build a new fueling plan for your next workout</Card.Description>
        </Card.Header>
        <Card.Footer class="px-4 pt-0">
            <Button class="gap-2" href={ROUTES.dashboard} size="sm">
                <Plus class="size-4" />
                Create plan
            </Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root class="gap-3 rounded-md py-4">
        <Card.Header class="px-4 pb-0">
            <Card.Title class="text-base font-medium">Browse supplements</Card.Title>
            <Card.Description>Explore the catalog of available products</Card.Description>
        </Card.Header>
        <Card.Footer class="px-4 pt-0">
            <Button class="gap-2"
                href={ROUTES.admin.supplements}
                size="sm"
                variant="outline"
            >
                <Search class="size-4" />
                Browse supplements
            </Button>
        </Card.Footer>
    </Card.Root>
</section>
