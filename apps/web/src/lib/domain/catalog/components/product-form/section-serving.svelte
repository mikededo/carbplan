<script lang="ts">
    import { FieldError, FieldLabel, FieldRoot, FieldSeparator } from '@carbplan/ui/field'
    import { Input } from '@carbplan/ui/input'

    import { getProductFormContext } from './context.svelte'

    const context = getProductFormContext()

    const onServingSizeInput = (e: Event) => {
        context.updateField('servingSize', (e.target as HTMLInputElement).value)
    }

    const onServingUnitInput = (e: Event) => {
        context.updateField('servingUnit', (e.target as HTMLInputElement).value)
    }

    const onServingsPerPackageInput = (e: Event) => {
        context.updateField('servingsPerPackage', (e.target as HTMLInputElement).value)
    }
</script>

<FieldSeparator />
<p class="text-sm font-medium">Serving Information</p>

<div class="grid grid-cols-3 gap-2 sm:gap-4">
    <FieldRoot data-invalid={!!context.errors.servingSize || undefined}>
        <FieldLabel for="servingSize">Size *</FieldLabel>
        <Input
            id="servingSize"
            min="0"
            placeholder="e.g. 60"
            step="0.1"
            type="number"
            value={context.state.servingSize}
            oninput={onServingSizeInput}
            aria-invalid={!!context.errors.servingSize}
        />
        <FieldError errors={context.errors.servingSize ? [{ message: context.errors.servingSize }] : undefined} />
    </FieldRoot>

    <FieldRoot data-invalid={!!context.errors.servingUnit || undefined}>
        <FieldLabel for="servingUnit">Unit *</FieldLabel>
        <Input
            id="servingUnit"
            placeholder="e.g. g, ml"
            value={context.state.servingUnit}
            oninput={onServingUnitInput}
            aria-invalid={!!context.errors.servingUnit}
        />
        <FieldError errors={context.errors.servingUnit ? [{ message: context.errors.servingUnit }] : undefined} />
    </FieldRoot>

    <FieldRoot data-invalid={!!context.errors.servingsPerPackage || undefined}>
        <FieldLabel for="servingsPerPackage">Per Package</FieldLabel>
        <Input
            id="servingsPerPackage"
            min="1"
            placeholder="e.g. 1"
            type="number"
            value={context.state.servingsPerPackage}
            oninput={onServingsPerPackageInput}
            aria-invalid={!!context.errors.servingsPerPackage}
        />
        <FieldError errors={context.errors.servingsPerPackage ? [{ message: context.errors.servingsPerPackage }] : undefined} />
    </FieldRoot>
</div>
