<script lang="ts">
    import type { CatalogProduct } from '$lib/domain/catalog/service'

    import type { CatalogBrand, CatalogResult } from '../../queries/catalog'

    import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from '@kilo/ui/table'
    import { cn } from '@kilo/ui/utils'
    import {
        ArrowDownIcon,
        ArrowUpDownIcon,
        ArrowUpIcon,
        MinusIcon,
        PlusIcon
    } from '@lucide/svelte'

    import ProductFormBadge from '$lib/domain/product/components/product-form-badge.svelte'

    import { createProductsTableContext, TABLE_COLUMNS } from '../../context/products-table.svelte'
    import CaffeineCell from './caffeine-cell.svelte'
    import TableFilters from './table-filters.svelte'

    type Props = {
        brands: CatalogResult
        onEditBrand?: (brand: CatalogBrand) => void
        onEditProduct?: (product: CatalogProduct) => void
    }
    const { brands, onEditBrand, onEditProduct }: Props = $props()

    const table = createProductsTableContext(() => brands)

    const formatServing = (product: CatalogProduct) =>
        `${product.servingSize}${product.servingUnit}`

    const formatValue = (value: null | number, unit: string) =>
        value !== null ? `${value}${unit}` : '-'

    const handleEditBrand = (brand: CatalogBrand) => (e: MouseEvent) => {
        e.stopPropagation()
        onEditBrand?.(brand)
    }

    const handleEditProduct = (product: CatalogProduct) => () => {
        onEditProduct?.(product)
    }
</script>

<div class="flex flex-col gap-4">
    <TableFilters />

    <div class="max-h-[calc(100vh-14rem)] overflow-auto rounded-md border" style="scrollbar-gutter: stable">
        <TableRoot>
            <TableHeader class="sticky top-0 z-10 bg-background">
                <TableRow>
                    {@render table_header()}
                </TableRow>
            </TableHeader>

            <TableBody>
                {#each table.filteredBrands as brand (brand.id)}
                    {@const isCollapsed = table.collapsedBrands.has(brand.id)}
                    <TableRow
                        class="cursor-pointer bg-muted hover:bg-muted/80"
                        onclick={table.onToggleCollapseBrand(brand.id)}
                    >
                        <TableCell colspan={TABLE_COLUMNS.length}>
                            <div class="flex items-center gap-2 font-medium">
                                {#if isCollapsed}
                                    <PlusIcon class="size-3.5 shrink-0" />
                                {:else}
                                    <MinusIcon class="size-3.5 shrink-0" />
                                {/if}
                                <button
                                    class="hover:underline"
                                    type="button"
                                    onclick={handleEditBrand(brand)}
                                >
                                    {brand.name}
                                </button>
                                <span class="font-normal text-muted-foreground">
                                    ({brand.products.length} products)
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                    {#if !isCollapsed}
                        {#each brand.products as product (product.id)}
                            <TableRow>
                                <TableCell class="min-w-120 pl-8">
                                    <button
                                        class="outline-none hover:underline"
                                        type="button"
                                        onclick={handleEditProduct(product)}
                                    >
                                        {product.name}
                                    </button>
                                    {#if product.flavor}
                                        <span class="text-sm text-muted-foreground">
                                            ({product.flavor})
                                        </span>
                                    {/if}
                                </TableCell>
                                <TableCell style="min-width: 96px">
                                    <ProductFormBadge form={product.form} />
                                </TableCell>
                                <TableCell>{formatServing(product)}</TableCell>
                                <TableCell>{formatValue(product.calories, 'kcal') ?? '-'}</TableCell>
                                <TableCell>{formatValue(product.carbsG, 'g')}</TableCell>
                                <TableCell>{formatValue(product.sugarG, 'g')}</TableCell>
                                <TableCell>{formatValue(product.sodiumMg, 'mg')}</TableCell>
                                <TableCell>
                                    <CaffeineCell caffeine={product.caffeineMg} />
                                </TableCell>
                            </TableRow>
                        {/each}
                    {/if}
                {:else}
                    <TableRow>
                        <TableCell class="h-24 text-center" colspan={TABLE_COLUMNS.length}>
                            No products found.
                        </TableCell>
                    </TableRow>
                {/each}
            </TableBody>
        </TableRoot>
    </div>

    <p class="text-sm text-muted-foreground">
        Showing {table.filteredProductsCount} of {table.totalProducts} products
    </p>
</div>

{#snippet table_header()}
    {#each TABLE_COLUMNS as column (column.key)}
        <TableHead style={column.minSize ? `min-width: ${column.minSize}px` : undefined}>
            {#if column.sortable}
                <button
                    class={cn('flex items-center gap-1.5 hover:text-foreground', column.key === 'name' && 'pl-6')}
                    type="button"
                    onclick={table.onSortColumn(column.key)}
                >
                    {column.label}
                    {#if table.sortColumn === column.key}
                        {#if table.sortDirection === 'asc'}
                            <ArrowUpIcon class="size-3.5" />
                        {:else}
                            <ArrowDownIcon class="size-3.5" />
                        {/if}
                    {:else}
                        <ArrowUpDownIcon class="size-3.5 text-muted-foreground" />
                    {/if}
                </button>
            {:else}
                {column.label}
            {/if}
        </TableHead>
    {/each}
{/snippet}
