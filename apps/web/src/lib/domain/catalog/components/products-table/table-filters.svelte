<script lang="ts">
    import { Input } from '@carbplan/ui/input'
    import { Kbd, KbdGroup } from '@carbplan/ui/kbd'
    import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from '@carbplan/ui/select'
    import {
        ComponentIcon,
        SearchIcon
    } from '@lucide/svelte'

    import { getProductsTableContext } from '../../context/products-table.svelte'
    import AllFilters, { ALL_TYPES_OPTION, formOptions } from './all-filters.svelte'

    let inputRef = $state<HTMLInputElement | null>(null)
    const table = getProductsTableContext()
    const selectedProductForms = $derived(
        table.formFilter.size > 0 ? [...table.formFilter] : [ALL_TYPES_OPTION.value]
    )

    $effect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!inputRef) {
                return
            }

            const isFocusShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'l'
            if (!isFocusShortcut) {
                return
            }

            event.preventDefault()
            if (document.activeElement === inputRef) {
                inputRef.blur()
            } else {
                inputRef.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
        }
    })
</script>

<div class="flex shrink-0 items-center gap-2">
    <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-2.5 text-muted-foreground peer-disabled:opacity-50">
            <SearchIcon class="size-4 text-muted-foreground" />
        </div>
        <Input
            class="peer pl-8 text-sm"
            bind:ref={inputRef}
            bind:value={table.globalFilter}
            placeholder="Search products..."
        />
        <KbdGroup class="absolute inset-e-2 top-2 gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>L</Kbd>
        </KbdGroup>
    </div>
    <SelectRoot
        type="multiple"
        value={selectedProductForms}
        onValueChange={table.onProductFormChange}
    >
        <SelectTrigger class="hidden w-36 shrink-0 @xl/page-content:inline-flex">
            {#if selectedProductForms.length > 0}
                <span class="w-28 truncate text-left">
                    {selectedProductForms
                        .map((filter) => [ALL_TYPES_OPTION, ...formOptions].find((option) => option.value === filter)?.label)
                        .filter(Boolean)
                        .join(', ')}
                </span>
            {:else}
                <span class="flex items-center gap-2">
                    <ComponentIcon class="size-3.5" />
                    All types
                </span>
            {/if}
        </SelectTrigger>
        <SelectContent>
            <SelectItem value={ALL_TYPES_OPTION.value}>
                <ALL_TYPES_OPTION.Icon class="size-3.5" />
                {ALL_TYPES_OPTION.label}
            </SelectItem>
            {#each formOptions as option (option.value)}
                <SelectItem value={option.value}>
                    <option.Icon class="size-3.5" />
                    {option.label}
                </SelectItem>
            {/each}
        </SelectContent>
    </SelectRoot>
    <AllFilters />
</div>
