<script lang="ts">
    import type { ProductForm } from '@carbplan/domain/product'

    import { ProductFormSchema } from '@carbplan/domain/product'

    import { PRODUCT_FORM_LABELS } from '$lib/domain/catalog/schemas'
    import FieldDescription from '$lib/domain/ui/field/field-description.svelte'
    import FieldError from '$lib/domain/ui/field/field-error.svelte'
    import FieldLabel from '$lib/domain/ui/field/field-label.svelte'
    import FieldRoot from '$lib/domain/ui/field/field.svelte'
    import Input from '$lib/domain/ui/input/input.svelte'
    import SelectContent from '$lib/domain/ui/select/select-content.svelte'
    import SelectItem from '$lib/domain/ui/select/select-item.svelte'
    import SelectTrigger from '$lib/domain/ui/select/select-trigger.svelte'
    import SelectRoot from '$lib/domain/ui/select/select.svelte'

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
        context.updateField('form', (value ?? '') as '' | ProductForm)
    }

    const productFormValues = ProductFormSchema.options
</script>

<div class="grid grid-cols-2 gap-2 sm:gap-4">
    <FieldRoot data-invalid={!!context.errors.brandId || undefined}>
        <FieldLabel for="brandId">Brand *</FieldLabel>
        <SelectRoot
            disabled={context.isLoadingBrands}
            type="single"
            value={context.state.brandId}
            onValueChange={(v) => context.updateField('brandId', v ?? '')}
        >
            <SelectTrigger class="w-full" id="brandId" aria-invalid={!!context.errors.brandId}>
                {context.brands.find((b) => b.id === context.state.brandId)?.name ?? 'Select a brand'}
            </SelectTrigger>
            <SelectContent class="max-h-120">
                {#each context.brands as brand (brand.id)}
                    <SelectItem label={brand.name} value={brand.id} />
                {/each}
            </SelectContent>
        </SelectRoot>
        <FieldError errors={context.errors.brandId ? [{ message: context.errors.brandId }] : undefined} />
    </FieldRoot>

    <FieldRoot data-invalid={!!context.errors.form || undefined}>
        <FieldLabel for="form">Form *</FieldLabel>
        <SelectRoot
            type="single"
            value={context.state.form}
            onValueChange={onChangeProductForm}
        >
            <SelectTrigger class="w-full" id="form" aria-invalid={!!context.errors.form}>
                {context.state.form ? PRODUCT_FORM_LABELS[context.state.form] : 'Select a form'}
            </SelectTrigger>
            <SelectContent>
                {#each productFormValues as productForm (productForm)}
                    <SelectItem label={PRODUCT_FORM_LABELS[productForm]} value={productForm} />
                {/each}
            </SelectContent>
        </SelectRoot>
        <FieldError errors={context.errors.form ? [{ message: context.errors.form }] : undefined} />
    </FieldRoot>
</div>

<div class="grid grid-cols-2 gap-2 sm:gap-4">
    <FieldRoot data-invalid={!!context.errors.name || undefined}>
        <FieldLabel for="name">Name *</FieldLabel>
        <Input
            id="name"
            placeholder="e.g. Beta Fuel Energy Gel"
            value={context.state.name}
            oninput={onNameInput}
            aria-invalid={!!context.errors.name}
        />
        <FieldError errors={context.errors.name ? [{ message: context.errors.name }] : undefined} />
    </FieldRoot>

    <FieldRoot data-invalid={!!context.errors.flavor || undefined}>
        <FieldLabel for="flavor">Flavor</FieldLabel>
        <Input
            id="flavor"
            placeholder="e.g. Orange"
            value={context.state.flavor}
            oninput={onFlavorInput}
            aria-invalid={!!context.errors.flavor}
        />
        <FieldError errors={context.errors.flavor ? [{ message: context.errors.flavor }] : undefined} />
    </FieldRoot>
</div>

<FieldRoot data-invalid={!!context.errors.slug || undefined}>
    <FieldLabel for="slug">Slug *</FieldLabel>
    <Input
        id="slug"
        placeholder="e.g. beta-fuel-energy-gel-orange"
        value={context.state.slug}
        oninput={onSlugInput}
        aria-invalid={!!context.errors.slug}
    />
    <FieldDescription>
        URL-friendly identifier. Auto-generated from name.
    </FieldDescription>
    <FieldError errors={context.errors.slug ? [{ message: context.errors.slug }] : undefined} />
</FieldRoot>
