<script lang="ts">
    import type { ProductFormState } from './context.svelte'

    import { FieldError, FieldLabel, FieldRoot, FieldSeparator } from '@carbplan/ui/field'
    import { Input } from '@carbplan/ui/input'

    import { getProductFormContext } from './context.svelte'

    const context = getProductFormContext()

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
        context.updateField(field, (e.target as HTMLInputElement).value)
    }
</script>

<FieldSeparator />
<p class="text-sm font-medium">Nutrition per Serving</p>

<div class="grid grid-cols-2 gap-4 gap-x-2 sm:grid-cols-4 sm:gap-x-4">
    {#each nutritionFields as field (field.id)}
        <FieldRoot data-invalid={!!context.errors[field.id] || undefined}>
            <FieldLabel for={field.id}>{field.label}</FieldLabel>
            <Input
                id={field.id}
                min="0"
                placeholder={field.placeholder}
                step={field.step}
                type="number"
                value={context.state[field.id]}
                oninput={onInput(field.id)}
                aria-invalid={!!context.errors[field.id]}
            />
            <FieldError errors={context.errors[field.id] ? [{ message: context.errors[field.id] }] : undefined} />
        </FieldRoot>
    {/each}
</div>
