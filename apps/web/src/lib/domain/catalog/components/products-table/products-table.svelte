<script lang="ts">
    import type { Product } from '$lib/database/types.g'

    import type { CatalogBrand, CatalogResult } from '../../queries'

    import {
        ArrowDownIcon,
        ArrowUpDownIcon,
        ArrowUpIcon,
        MinusIcon,
        PlusIcon
    } from '@lucide/svelte'

    import { ProductFormBadge } from '$lib/domain/product/components'
    import * as Table from '$lib/domain/ui/table'
    import { cn } from '$lib/utils'

    import { createProductsTableContext, TABLE_COLUMNS } from '../../context'
    import CaffeineCell from './caffeine-cell.svelte'
    import TableFilters from './table-filters.svelte'

    type Props = {
        brands: CatalogResult
        onEditBrand?: (brand: CatalogBrand) => void
        onEditProduct?: (product: Product) => void
    }
    const { brands, onEditBrand, onEditProduct }: Props = $props()

    const table = createProductsTableContext(() => brands)

    const formatServing = (product: Product) =>
        `${product.serving_size}${product.serving_unit}`

    const formatValue = (value: null | number, unit: string) =>
        value !== null ? `${value}${unit}` : '-'

    const handleEditBrand = (brand: CatalogBrand) => (e: MouseEvent) => {
        e.stopPropagation()
        onEditBrand?.(brand)
    }

    const handleEditProduct = (product: Product) => () => {
        onEditProduct?.(product)
    }
</script>

<div class="flex flex-col gap-4">
    <TableFilters />

    <div class="max-h-[calc(100vh-14rem)] overflow-auto rounded-md border" style="scrollbar-gutter: stable">
        <Table.Root>
            <Table.Header class="sticky top-0 z-10 bg-background">
                <Table.Row>
                    {@render table_header()}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {#each table.filteredBrands as brand (brand.id)}
                    {@const isCollapsed = table.collapsedBrands.has(brand.id)}
                    <Table.Row
                        class="cursor-pointer bg-muted hover:bg-muted/80"
                        onclick={table.onToggleCollapseBrand(brand.id)}
                    >
                        <Table.Cell colspan={TABLE_COLUMNS.length}>
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
                        </Table.Cell>
                    </Table.Row>
                    {#if !isCollapsed}
                        {#each brand.products as product (product.id)}
                            <Table.Row>
                                <Table.Cell class="min-w-120 pl-8">
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
                                </Table.Cell>
                                <Table.Cell style="min-width: 96px">
                                    <ProductFormBadge form={product.form} />
                                </Table.Cell>
                                <Table.Cell>{formatServing(product)}</Table.Cell>
                                <Table.Cell>{formatValue(product.calories, 'kcal') ?? '-'}</Table.Cell>
                                <Table.Cell>{formatValue(product.carbs_g, 'g')}</Table.Cell>
                                <Table.Cell>{formatValue(product.sugar_g, 'g')}</Table.Cell>
                                <Table.Cell>{formatValue(product.sodium_mg, 'mg')}</Table.Cell>
                                <Table.Cell>
                                    <CaffeineCell caffeine={product.caffeine_mg} />
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    {/if}
                {:else}
                    <Table.Row>
                        <Table.Cell class="h-24 text-center" colspan={TABLE_COLUMNS.length}>
                            No products found.
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>

    <p class="text-sm text-muted-foreground">
        Showing {table.filteredProductsCount} of {table.totalProducts} products
    </p>
</div>

{#snippet table_header()}
    {#each TABLE_COLUMNS as column (column.key)}
        <Table.Head style={column.minSize ? `min-width: ${column.minSize}px` : undefined}>
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
        </Table.Head>
    {/each}
{/snippet}
