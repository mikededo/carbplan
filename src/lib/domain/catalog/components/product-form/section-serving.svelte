<script lang="ts">
    import * as Field from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'

    import { getProductFormContext } from './context.svelte'

    const ctx = getProductFormContext()

    const onServingSizeInput = (e: Event) => {
        ctx.updateField('servingSize', (e.target as HTMLInputElement).value)
    }

    const onServingUnitInput = (e: Event) => {
        ctx.updateField('servingUnit', (e.target as HTMLInputElement).value)
    }

    const onServingsPerPackageInput = (e: Event) => {
        ctx.updateField('servingsPerPackage', (e.target as HTMLInputElement).value)
    }
</script>

<Field.Separator />
<p class="text-sm font-medium">Serving Information</p>

<div class="grid grid-cols-3 gap-2 sm:gap-4">
    <Field.Field data-invalid={!!ctx.errors.servingSize || undefined}>
        <Field.Label for="servingSize">Size *</Field.Label>
        <Input
            id="servingSize"
            min="0"
            placeholder="e.g. 60"
            step="0.1"
            type="number"
            value={ctx.state.servingSize}
            oninput={onServingSizeInput}
            aria-invalid={!!ctx.errors.servingSize}
        />
        <Field.Error errors={ctx.errors.servingSize ? [{ message: ctx.errors.servingSize }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!ctx.errors.servingUnit || undefined}>
        <Field.Label for="servingUnit">Unit *</Field.Label>
        <Input
            id="servingUnit"
            placeholder="e.g. g, ml"
            value={ctx.state.servingUnit}
            oninput={onServingUnitInput}
            aria-invalid={!!ctx.errors.servingUnit}
        />
        <Field.Error errors={ctx.errors.servingUnit ? [{ message: ctx.errors.servingUnit }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!ctx.errors.servingsPerPackage || undefined}>
        <Field.Label for="servingsPerPackage">Per Package</Field.Label>
        <Input
            id="servingsPerPackage"
            min="1"
            placeholder="e.g. 1"
            type="number"
            value={ctx.state.servingsPerPackage}
            oninput={onServingsPerPackageInput}
            aria-invalid={!!ctx.errors.servingsPerPackage}
        />
        <Field.Error errors={ctx.errors.servingsPerPackage ? [{ message: ctx.errors.servingsPerPackage }] : undefined} />
    </Field.Field>
</div>
