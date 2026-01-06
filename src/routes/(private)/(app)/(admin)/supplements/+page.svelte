<script lang="ts">
    import { PackagePlusIcon, PlusIcon } from '@lucide/svelte'

    import { ProductsTable } from '$lib/domain/catalog/components'
    import { useCatalogQuery } from '$lib/domain/catalog/queries'
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'
    import { Button } from '$lib/domain/ui/button'

    const catalogQuery = useCatalogQuery()
</script>

<svelte:head>
    <title>Supplements — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Admin', 'Supplements']}>
    {#snippet actions()}
        <Button size="sm" variant="outline">
            <PlusIcon />
            Add Brand
        </Button>
        <Button size="sm">
            <PackagePlusIcon />
            Add Product
        </Button>
    {/snippet}
</PageHeader>

<PageScrollarea>
    <div class="p-6">
        {#if catalogQuery.isPending}
            <div class="flex items-center justify-center py-12">
                <p class="text-muted-foreground">Loading supplements...</p>
            </div>
        {:else if catalogQuery.isError}
            <div class="flex items-center justify-center py-12">
                <p class="text-destructive">Failed to load supplements</p>
            </div>
        {:else if catalogQuery.data}
            <ProductsTable brands={catalogQuery.data} />
        {/if}
    </div>
</PageScrollarea>
