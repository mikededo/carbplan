<script lang="ts">
    import type { ProductFormState } from './context.svelte'

    import * as Field from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'

    import { getProductFormContext } from './context.svelte'

    const ctx = getProductFormContext()

    type NutritionField = {
        id: keyof ProductFormState
        label: string
        placeholder: string
        step?: string
    }

    const nutritionFields: NutritionField[] = [
        { id: 'calories', label: 'Calories', placeholder: 'kcal' },
        { id: 'carbsG', label: 'Carbs (g)', placeholder: 'g', step: '0.1' },
        { id: 'sugarG', label: 'Sugar (g)', placeholder: 'g', step: '0.1' },
        { id: 'proteinG', label: 'Protein (g)', placeholder: 'g', step: '0.1' },
        { id: 'fatG', label: 'Fat (g)', placeholder: 'g', step: '0.1' },
        { id: 'sodiumMg', label: 'Sodium (mg)', placeholder: 'mg' },
        { id: 'caffeineMg', label: 'Caffeine (mg)', placeholder: 'mg' }
    ]

    const onInput = (field: keyof ProductFormState) => (e: Event) => {
        ctx.updateField(field, (e.target as HTMLInputElement).value)
    }
</script>

<Field.Separator />
<p class="text-sm font-medium">Nutrition per Serving</p>

<div class="grid grid-cols-2 gap-4 gap-x-2 sm:grid-cols-4 sm:gap-x-4">
    {#each nutritionFields as field (field.id)}
        <Field.Field data-invalid={!!ctx.errors[field.id] || undefined}>
            <Field.Label for={field.id}>{field.label}</Field.Label>
            <Input
                id={field.id}
                min="0"
                placeholder={field.placeholder}
                step={field.step}
                type="number"
                value={ctx.state[field.id]}
                oninput={onInput(field.id)}
                aria-invalid={!!ctx.errors[field.id]}
            />
            <Field.Error errors={ctx.errors[field.id] ? [{ message: ctx.errors[field.id] }] : undefined} />
        </Field.Field>
    {/each}
</div>
