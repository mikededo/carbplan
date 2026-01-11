<script lang="ts">
    import type { Product } from '$lib/database/types.g'
    import type { CatalogBrand } from '$lib/domain/catalog/queries'

    import { PackagePlusIcon, PlusIcon } from '@lucide/svelte'

    import { BrandForm, ProductFormDialog, ProductsTable } from '$lib/domain/catalog/components'
    import { useCatalogQuery } from '$lib/domain/catalog/queries'
    import { PageHeader, PageScrollarea } from '$lib/domain/layout/components'
    import { Button } from '$lib/domain/ui/button'

    type DialogState<T> = { item: T | undefined, open: boolean }

    const catalogQuery = useCatalogQuery()

    const brandFormState = $state<DialogState<CatalogBrand>>({
        item: undefined,
        open: false
    })
    const productFormState = $state<DialogState<Product>>({
        item: undefined,
        open: false
    })

    const onAddBrand = () => {
        brandFormState.item = undefined
        brandFormState.open = true
    }

    const onEditBrand = (brand: CatalogBrand) => {
        brandFormState.item = brand
        brandFormState.open = true
    }

    const onBrandFormOpenChange = (open: boolean) => {
        brandFormState.open = open
        if (!open) {
            brandFormState.item = undefined
        }
    }

    const onAddProduct = () => {
        productFormState.item = undefined
        productFormState.open = true
    }

    const onEditProduct = (product: Product) => {
        productFormState.item = product
        productFormState.open = true
    }

    const onProductFormOpenChange = (open: boolean) => {
        productFormState.open = open
        if (!open) {
            productFormState.item = undefined
        }
    }
</script>

<svelte:head>
    <title>Catalog — CarbPlan</title>
</svelte:head>

<PageHeader crumbs={['Admin', 'Catalog']}>
    {#snippet actions()}
        <Button size="sm" variant="outline" onclick={onAddBrand}>
            <PlusIcon />
            Add Brand
        </Button>
        <Button size="sm" onclick={onAddProduct}>
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
            <ProductsTable brands={catalogQuery.data} {onEditBrand} {onEditProduct} />
        {/if}
    </div>
</PageScrollarea>

<BrandForm
    brand={brandFormState.item}
    open={brandFormState.open}
    onOpenChange={onBrandFormOpenChange}
/>

<ProductFormDialog
    open={productFormState.open}
    product={productFormState.item}
    onOpenChange={onProductFormOpenChange}
/>
