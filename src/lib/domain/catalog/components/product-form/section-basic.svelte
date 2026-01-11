<script lang="ts">
    import { ProductFormValues } from '$lib/database/types.g'
    import { PRODUCT_FORM_LABELS } from '$lib/domain/catalog/schemas'
    import * as Field from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'
    import * as Select from '$lib/domain/ui/select'

    import { getProductFormContext } from './context.svelte'

    const ctx = getProductFormContext()

    const onNameInput = (e: Event) => {
        ctx.updateField('name', (e.target as HTMLInputElement).value)
    }

    const onFlavorInput = (e: Event) => {
        ctx.updateField('flavor', (e.target as HTMLInputElement).value)
    }

    const onSlugInput = (e: Event) => {
        ctx.disableAutoSlug()
        ctx.updateField('slug', (e.target as HTMLInputElement).value)
    }
</script>

<div class="grid grid-cols-2 gap-2 sm:gap-4">
    <Field.Field data-invalid={!!ctx.errors.brandId || undefined}>
        <Field.Label for="brandId">Brand *</Field.Label>
        <Select.Root
            disabled={ctx.isLoadingBrands}
            type="single"
            value={ctx.state.brandId}
            onValueChange={(v) => ctx.updateField('brandId', v ?? '')}
        >
            <Select.Trigger class="w-full" id="brandId" aria-invalid={!!ctx.errors.brandId}>
                {ctx.brands.find((b) => b.id === ctx.state.brandId)?.name ?? 'Select a brand'}
            </Select.Trigger>
            <Select.Content class="max-h-120">
                {#each ctx.brands as brand (brand.id)}
                    <Select.Item label={brand.name} value={brand.id} />
                {/each}
            </Select.Content>
        </Select.Root>
        <Field.Error errors={ctx.errors.brandId ? [{ message: ctx.errors.brandId }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!ctx.errors.form || undefined}>
        <Field.Label for="form">Form *</Field.Label>
        <Select.Root
            type="single"
            value={ctx.state.form}
            onValueChange={(v) => ctx.updateField('form', v ?? '')}
        >
            <Select.Trigger class="w-full" id="form" aria-invalid={!!ctx.errors.form}>
                {ctx.state.form ? PRODUCT_FORM_LABELS[ctx.state.form] : 'Select a form'}
            </Select.Trigger>
            <Select.Content>
                {#each ProductFormValues as productForm (productForm)}
                    <Select.Item label={PRODUCT_FORM_LABELS[productForm]} value={productForm} />
                {/each}
            </Select.Content>
        </Select.Root>
        <Field.Error errors={ctx.errors.form ? [{ message: ctx.errors.form }] : undefined} />
    </Field.Field>
</div>

<div class="grid grid-cols-2 gap-2 sm:gap-4">
    <Field.Field data-invalid={!!ctx.errors.name || undefined}>
        <Field.Label for="name">Name *</Field.Label>
        <Input
            id="name"
            placeholder="e.g. Beta Fuel Energy Gel"
            value={ctx.state.name}
            oninput={onNameInput}
            aria-invalid={!!ctx.errors.name}
        />
        <Field.Error errors={ctx.errors.name ? [{ message: ctx.errors.name }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!ctx.errors.flavor || undefined}>
        <Field.Label for="flavor">Flavor</Field.Label>
        <Input
            id="flavor"
            placeholder="e.g. Orange"
            value={ctx.state.flavor}
            oninput={onFlavorInput}
            aria-invalid={!!ctx.errors.flavor}
        />
        <Field.Error errors={ctx.errors.flavor ? [{ message: ctx.errors.flavor }] : undefined} />
    </Field.Field>
</div>

<Field.Field data-invalid={!!ctx.errors.slug || undefined}>
    <Field.Label for="slug">Slug *</Field.Label>
    <Input
        id="slug"
        placeholder="e.g. beta-fuel-energy-gel-orange"
        value={ctx.state.slug}
        oninput={onSlugInput}
        aria-invalid={!!ctx.errors.slug}
    />
    <Field.Description>
        URL-friendly identifier. Auto-generated from name.
    </Field.Description>
    <Field.Error errors={ctx.errors.slug ? [{ message: ctx.errors.slug }] : undefined} />
</Field.Field>
