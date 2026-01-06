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

    import { formatProductForm } from '../../schemas'

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

</script>

<script lang="ts">
    import type { ProductForm } from '$lib/database/types.g'

    import { SlidersHorizontalIcon } from '@lucide/svelte'

    import { Button } from '$lib/domain/ui/button'
    import { Label } from '$lib/domain/ui/label'
    import {
        Sheet,
        SheetContent,
        SheetFooter,
        SheetHeader,
        SheetTitle,
        SheetTrigger
    } from '$lib/domain/ui/sheet'
    import { Toggle } from '$lib/domain/ui/toggle'

    import { getProductsTableContext } from '../../context'

    const table = getProductsTableContext()

    const onToggleProductForm = (value: ProductForm) => () => {
        table.onToggleProductForm(value)
    }
</script>

<Sheet>
    <SheetTrigger>
        {#snippet child({ props })}
            <Button {...props} variant="outline">
                <SlidersHorizontalIcon />
                Filters
            </Button>
        {/snippet}
    </SheetTrigger>
    <SheetContent class="gap-0">
        <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div class="space-y-3 px-4">
            <div class="flex flex-col gap-2">
                <Label>Types</Label>
                <div class="flex flex-wrap gap-1">
                    {#each formOptions as option (option.value)}
                        <Toggle size="sm" variant="outline" onclick={onToggleProductForm(option.value)}>
                            <option.Icon class="size-3.5" />
                            {option.label}
                        </Toggle>
                    {/each}
                </div>
            </div>
        </div>

        <SheetFooter>
            <Button variant="ghost">Reset</Button>
            <Button variant="outline">Apply</Button>
        </SheetFooter>
    </SheetContent>
</Sheet>
