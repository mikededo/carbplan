<script lang="ts" module>
    import {
        BoxIcon,
        CandyIcon,
        ComponentIcon,
        CookieIcon,
        DropletIcon,
        DropletsIcon,
        FlaskConicalIcon,
        GlassWaterIcon,
        PillIcon
    } from '@lucide/svelte'

    import { formatProductForm } from '$lib/domain/product/components/product-form-badge.svelte'

    import { CAFFEINE_MAX, CALORIES_MAX } from '../../context'

    export const ALL_TYPES_OPTION = { Icon: ComponentIcon, label: 'All types', value: '' }
    export const formOptions = [
        { Icon: DropletsIcon, label: formatProductForm('gel'), value: 'gel' },
        { Icon: CookieIcon, label: formatProductForm('bar'), value: 'bar' },
        { Icon: CandyIcon, label: formatProductForm('chew'), value: 'chew' },
        { Icon: GlassWaterIcon, label: formatProductForm('drink_mix'), value: 'drink_mix' },
        { Icon: FlaskConicalIcon, label: formatProductForm('powder'), value: 'powder' },
        { Icon: BoxIcon, label: formatProductForm('solid'), value: 'solid' },
        { Icon: PillIcon, label: formatProductForm('capsule'), value: 'capsule' },
        { Icon: DropletIcon, label: formatProductForm('liquid'), value: 'liquid' }
    ] as const

    const CARBS_MAX = 150
    const SODIUM_MAX = 600
</script>

<script lang="ts">
    import type { ProductForm } from '$lib/database/types.g'

    import { BuildingIcon, SlidersHorizontalIcon } from '@lucide/svelte'

    import { Button } from '$lib/domain/ui/button'
    import { Label } from '$lib/domain/ui/label'
    import * as Select from '$lib/domain/ui/select'
    import {
        Sheet,
        SheetContent,
        SheetFooter,
        SheetHeader,
        SheetTitle,
        SheetTrigger
    } from '$lib/domain/ui/sheet'
    import { Slider } from '$lib/domain/ui/slider'
    import { Toggle } from '$lib/domain/ui/toggle'

    import { getProductsTableContext } from '../../context'

    const table = getProductsTableContext()

    let caffeineRange = $state<number[]>([0, CAFFEINE_MAX])
    let caloriesRange = $state<number[]>([0, CALORIES_MAX])
    let carbsRange = $state<number[]>([0, CARBS_MAX])
    let sodiumRange = $state<number[]>([0, SODIUM_MAX])

    const selectedBrands = $derived([...table.brandFilter])
    const sortedBrands = $derived(
        table.brands.toSorted((a, b) => a.name.localeCompare(b.name))
    )

    const caffeineLabel = $derived(
        caffeineRange[0] === 0 && caffeineRange[1] === CAFFEINE_MAX
            ? 'Any'
            : `${caffeineRange[0]}mg - ${caffeineRange[1]}mg`
    )
    const caloriesLabel = $derived(
        caloriesRange[0] === 0 && caloriesRange[1] === CALORIES_MAX
            ? 'Any'
            : `${caloriesRange[0]} - ${caloriesRange[1]} kcal`
    )
    const carbsLabel = $derived(
        carbsRange[0] === 0 && carbsRange[1] === CARBS_MAX
            ? 'Any'
            : `${carbsRange[0]}g - ${carbsRange[1]}g`
    )
    const sodiumLabel = $derived(
        sodiumRange[0] === 0 && sodiumRange[1] === SODIUM_MAX
            ? 'Any'
            : `${sodiumRange[0]}mg - ${sodiumRange[1]}mg`
    )

    const onToggleProductForm = (value: ProductForm) => () => {
        table.onToggleProductForm(value)
    }

    const onCaffeineRangeChange = (value: number[]) => {
        caffeineRange = value
        const min = value[0] === 0 ? null : value[0]
        const max = value[1] === CAFFEINE_MAX ? null : value[1]
        table.onCaffeineChange(min, max)
    }

    const onCaloriesRangeChange = (value: number[]) => {
        caloriesRange = value
        const min = value[0] === 0 ? null : value[0]
        const max = value[1] === CALORIES_MAX ? null : value[1]
        table.onCaloriesChange(min, max)
    }

    const onCarbsRangeChange = (value: number[]) => {
        carbsRange = value
        const min = value[0] === 0 ? null : value[0]
        const max = value[1] === CARBS_MAX ? null : value[1]
        table.onCarbsChange(min, max)
    }

    const onSodiumRangeChange = (value: number[]) => {
        sodiumRange = value
        const min = value[0] === 0 ? null : value[0]
        const max = value[1] === SODIUM_MAX ? null : value[1]
        table.onSodiumChange(min, max)
    }

    const onReset = () => {
        caffeineRange = [0, CAFFEINE_MAX]
        caloriesRange = [0, CALORIES_MAX]
        carbsRange = [0, CARBS_MAX]
        sodiumRange = [0, SODIUM_MAX]
        table.onResetFilters()
    }
</script>

<Sheet>
    <SheetTrigger>
        {#snippet child({ props })}
            <Button {...props} class="relative" variant="outline">
                <SlidersHorizontalIcon />
                Filters
                <span class="tabular-nums">
                    ({table.activeFiltersCount})
                </span>
            </Button>
        {/snippet}
    </SheetTrigger>

    <SheetContent class="inset-y-2 right-2 flex h-auto min-w-120 flex-col gap-0 rounded-lg">
        <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div class="flex-1 space-y-6 overflow-y-auto px-4 py-2">
            <div class="flex flex-col gap-2">
                <Label>Product types</Label>
                <div class="flex flex-wrap gap-1">
                    {#each formOptions as option (option.value)}
                        <Toggle
                            pressed={table.formFilter.has(option.value)}
                            size="sm"
                            variant="outline"
                            onclick={onToggleProductForm(option.value)}
                        >
                            <option.Icon class="size-3.5" />
                            {option.label}
                        </Toggle>
                    {/each}
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <Label>Caffeine per serving</Label>
                    <span class="text-sm text-muted-foreground">{caffeineLabel}</span>
                </div>
                <Slider
                    max={CAFFEINE_MAX}
                    min={0}
                    step={10}
                    type="multiple"
                    value={caffeineRange}
                    onValueChange={onCaffeineRangeChange}
                />
                <div class="flex justify-between text-xs text-muted-foreground">
                    <span>0mg</span>
                    <span>{CAFFEINE_MAX}mg</span>
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <Label>Calories per serving</Label>
                    <span class="text-sm text-muted-foreground">{caloriesLabel}</span>
                </div>
                <Slider
                    max={CALORIES_MAX}
                    min={0}
                    step={25}
                    type="multiple"
                    value={caloriesRange}
                    onValueChange={onCaloriesRangeChange}
                />
                <div class="flex justify-between text-xs text-muted-foreground">
                    <span>0 kcal</span>
                    <span>{CALORIES_MAX} kcal</span>
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <Label>Carbs per serving</Label>
                    <span class="text-sm text-muted-foreground">{carbsLabel}</span>
                </div>
                <Slider
                    max={CARBS_MAX}
                    min={0}
                    step={5}
                    type="multiple"
                    value={carbsRange}
                    onValueChange={onCarbsRangeChange}
                />
                <div class="flex justify-between text-xs text-muted-foreground">
                    <span>0g</span>
                    <span>{CARBS_MAX}g</span>
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <Label>Sodium per serving</Label>
                    <span class="text-sm text-muted-foreground">{sodiumLabel}</span>
                </div>
                <Slider
                    max={SODIUM_MAX}
                    min={0}
                    step={25}
                    type="multiple"
                    value={sodiumRange}
                    onValueChange={onSodiumRangeChange}
                />
                <div class="flex justify-between text-xs text-muted-foreground">
                    <span>0mg</span>
                    <span>{SODIUM_MAX}mg</span>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <Label>Brands</Label>
                <Select.Root
                    type="multiple"
                    value={selectedBrands}
                    onValueChange={table.onBrandFilterChange}
                >
                    <Select.Trigger class="w-full">
                        {#if selectedBrands.length > 0}
                            <span class="truncate text-left">
                                {selectedBrands
                                    .map((id) => sortedBrands.find((b) => b.id === id)?.name)
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        {:else}
                            <span class="flex items-center gap-2">
                                <BuildingIcon class="size-3.5" />
                                All brands
                            </span>
                        {/if}
                    </Select.Trigger>
                    <Select.Content class="max-h-64">
                        {#each sortedBrands as brand (brand.id)}
                            <Select.Item value={brand.id}>
                                {brand.name}
                                <span class="ml-auto text-xs text-muted-foreground">
                                    {brand.products.length}
                                </span>
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>
        </div>

        <SheetFooter>
            <Button variant="ghost" onclick={onReset}>Reset all</Button>
        </SheetFooter>
    </SheetContent>
</Sheet>
