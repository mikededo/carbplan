<script lang="ts">
    import type { ProductFormType } from '$lib/database/types.g'

    import { ProductFormValues } from '$lib/database/types.g'
    import { PRODUCT_FORM_LABELS } from '$lib/domain/catalog/schemas'
    import * as Field from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'
    import * as Select from '$lib/domain/ui/select'

    import { getProductFormContext } from './context.svelte'

    const context = getProductFormContext()

    const onNameInput = (e: Event) => {
        context.updateField('name', (e.target as HTMLInputElement).value)
    }

    const onFlavorInput = (e: Event) => {
        context.updateField('flavor', (e.target as HTMLInputElement).value)
    }

    const onSlugInput = (e: Event) => {
        context.disableAutoSlug()
        context.updateField('slug', (e.target as HTMLInputElement).value)
    }

    const onChangeProductForm = (value: string) => {
        context.updateField('form', (value ?? '') as '' | ProductFormType)
    }
</script>

<div class="grid grid-cols-2 gap-2 sm:gap-4">
    <Field.Field data-invalid={!!context.errors.brandId || undefined}>
        <Field.Label for="brandId">Brand *</Field.Label>
        <Select.Root
            disabled={context.isLoadingBrands}
            type="single"
            value={context.state.brandId}
            onValueChange={(v) => context.updateField('brandId', v ?? '')}
        >
            <Select.Trigger class="w-full" id="brandId" aria-invalid={!!context.errors.brandId}>
                {context.brands.find((b) => b.id === context.state.brandId)?.name ?? 'Select a brand'}
            </Select.Trigger>
            <Select.Content class="max-h-120">
                {#each context.brands as brand (brand.id)}
                    <Select.Item label={brand.name} value={brand.id} />
                {/each}
            </Select.Content>
        </Select.Root>
        <Field.Error errors={context.errors.brandId ? [{ message: context.errors.brandId }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!context.errors.form || undefined}>
        <Field.Label for="form">Form *</Field.Label>
        <Select.Root
            type="single"
            value={context.state.form}
            onValueChange={onChangeProductForm}
        >
            <Select.Trigger class="w-full" id="form" aria-invalid={!!context.errors.form}>
                {context.state.form ? PRODUCT_FORM_LABELS[context.state.form] : 'Select a form'}
            </Select.Trigger>
            <Select.Content>
                {#each ProductFormValues as productForm (productForm)}
                    <Select.Item label={PRODUCT_FORM_LABELS[productForm]} value={productForm} />
                {/each}
            </Select.Content>
        </Select.Root>
        <Field.Error errors={context.errors.form ? [{ message: context.errors.form }] : undefined} />
    </Field.Field>
</div>

<div class="grid grid-cols-2 gap-2 sm:gap-4">
    <Field.Field data-invalid={!!context.errors.name || undefined}>
        <Field.Label for="name">Name *</Field.Label>
        <Input
            id="name"
            placeholder="e.g. Beta Fuel Energy Gel"
            value={context.state.name}
            oninput={onNameInput}
            aria-invalid={!!context.errors.name}
        />
        <Field.Error errors={context.errors.name ? [{ message: context.errors.name }] : undefined} />
    </Field.Field>

    <Field.Field data-invalid={!!context.errors.flavor || undefined}>
        <Field.Label for="flavor">Flavor</Field.Label>
        <Input
            id="flavor"
            placeholder="e.g. Orange"
            value={context.state.flavor}
            oninput={onFlavorInput}
            aria-invalid={!!context.errors.flavor}
        />
        <Field.Error errors={context.errors.flavor ? [{ message: context.errors.flavor }] : undefined} />
    </Field.Field>
</div>

<Field.Field data-invalid={!!context.errors.slug || undefined}>
    <Field.Label for="slug">Slug *</Field.Label>
    <Input
        id="slug"
        placeholder="e.g. beta-fuel-energy-gel-orange"
        value={context.state.slug}
        oninput={onSlugInput}
        aria-invalid={!!context.errors.slug}
    />
    <Field.Description>
        URL-friendly identifier. Auto-generated from name.
    </Field.Description>
    <Field.Error errors={context.errors.slug ? [{ message: context.errors.slug }] : undefined} />
</Field.Field>
