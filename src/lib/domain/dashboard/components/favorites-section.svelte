<script lang="ts">
    import type { CatalogProduct } from '$lib/database/types.g'

    import { HeartIcon } from '@lucide/svelte'

    import { ROUTES } from '$lib/constants/routes'
    import { ProductFormBadge } from '$lib/domain/product/components'
    import { Button } from '$lib/domain/ui/button'
    import * as Card from '$lib/domain/ui/card'

    type Props = { products: CatalogProduct[] }
    const { products }: Props = $props()
</script>

<section class="space-y-4">
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Favorites</h2>
        {#if products.length > 0}
            <Button href={ROUTES.admin.supplements} size="sm" variant="ghost">
                View all
            </Button>
        {/if}
    </div>

    {#if products.length === 0}
        <Card.Root class="gap-2 rounded-md border-dashed py-6">
            <Card.Content class="flex flex-col items-center justify-center px-4 text-center">
                <HeartIcon class="mb-2 size-5 text-muted-foreground" />
                <p class="text-sm text-muted-foreground">
                    No favorites yet. Browse supplements to add some.
                </p>
            </Card.Content>
        </Card.Root>
    {:else}
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {#each products as product (product.id)}
                <Card.Root class="gap-0 rounded-md py-2.5 transition-colors hover:bg-muted/50">
                    <Card.Content class="flex items-center gap-3 px-3">
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-medium">{product.name}</p>
                            <p class="truncate text-xs text-muted-foreground">{product.brand_name}</p>
                        </div>
                        {#if product.form}
                            <ProductFormBadge form={product.form} />
                        {/if}
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>
    {/if}
</section>
