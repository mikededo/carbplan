<script lang="ts">
    import {
        BoxIcon,
        CandyIcon,
        ComponentIcon,
        CookieIcon,
        DropletIcon,
        DropletsIcon,
        FlaskConicalIcon,
        GlassWaterIcon,
        PillIcon,
        SearchIcon,
        SlidersHorizontalIcon
    } from '@lucide/svelte'

    import { Input } from '$lib/domain/ui/input'
    import * as Select from '$lib/domain/ui/select'

    import { getProductsTableContext } from '../../context'
    import { formatProductForm } from '../../schemas'

    const table = getProductsTableContext()

    const formOptions = [
        { Icon: ComponentIcon, label: 'All types', value: '' },
        { Icon: DropletsIcon, label: formatProductForm('gel'), value: 'gel' },
        { Icon: CookieIcon, label: formatProductForm('bar'), value: 'bar' },
        { Icon: CandyIcon, label: formatProductForm('chew'), value: 'chew' },
        { Icon: GlassWaterIcon, label: formatProductForm('drink_mix'), value: 'drink_mix' },
        { Icon: FlaskConicalIcon, label: formatProductForm('powder'), value: 'powder' },
        { Icon: BoxIcon, label: formatProductForm('solid'), value: 'solid' },
        { Icon: PillIcon, label: formatProductForm('capsule'), value: 'capsule' },
        { Icon: DropletIcon, label: formatProductForm('liquid'), value: 'liquid' }
    ] as const
</script>

<div class="flex shrink-0 items-center gap-4">
    <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-2.5 text-muted-foreground peer-disabled:opacity-50">
            <SearchIcon class="size-4 text-muted-foreground" />
        </div>
        <Input
            class="peer pl-8"
            bind:value={table.globalFilter}
            placeholder="Search products..."
            type="search"
        />
    </div>
    <Select.Root type="single" value={table.formFilter} onValueChange={table.onFormFilterChange}>
        <Select.Trigger class="w-40">
            <span class="flex items-center gap-2">
                {#if table.formFilter}
                    {@const option = formOptions.find(({ value }) => table.formFilter === value)}
                    {#if option}
                        <option.Icon class="size-3.5" />
                        {option.label}
                    {/if}
                {:else}
                    <SlidersHorizontalIcon class="size-3.5" />
                    All types
                {/if}
            </span>
        </Select.Trigger>
        <Select.Content>
            {#each formOptions as option (option.value)}
                <Select.Item value={option.value}>
                    <option.Icon class="size-3.5" />
                    {option.label}
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div>
