<script lang="ts">
    import * as Field from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'

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

<Field.Separator />
<p class="text-sm font-medium">Serving Information</p>

<div class="grid grid-cols-3 gap-2 sm:gap-4">
    <Field.Field data-invalid={!!context.errors.servingSize || undefined}>
        <Field.Label for="servingSize">Size *</Field.Label>
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
        <Field.Error errors={context.errors.servingSize ? [{ message: context.errors.servingSize }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!context.errors.servingUnit || undefined}>
        <Field.Label for="servingUnit">Unit *</Field.Label>
        <Input
            id="servingUnit"
            placeholder="e.g. g, ml"
            value={context.state.servingUnit}
            oninput={onServingUnitInput}
            aria-invalid={!!context.errors.servingUnit}
        />
        <Field.Error errors={context.errors.servingUnit ? [{ message: context.errors.servingUnit }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!context.errors.servingsPerPackage || undefined}>
        <Field.Label for="servingsPerPackage">Per Package</Field.Label>
        <Input
            id="servingsPerPackage"
            min="1"
            placeholder="e.g. 1"
            type="number"
            value={context.state.servingsPerPackage}
            oninput={onServingsPerPackageInput}
            aria-invalid={!!context.errors.servingsPerPackage}
        />
        <Field.Error errors={context.errors.servingsPerPackage ? [{ message: context.errors.servingsPerPackage }] : undefined} />
    </Field.Field>
</div>
