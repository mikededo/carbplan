<script lang="ts">
    import type { Product, ProductFormType } from '$lib/database/types.g'

    import { LoaderCircleIcon, SaveIcon } from '@lucide/svelte'
    import * as v from 'valibot'

    import { ProductFormValues } from '$lib/database/types.g'
    import { createProductMutation, updateProductMutation, useCatalogQuery } from '$lib/domain/catalog/queries'
    import {
        generateSlug,
        PRODUCT_FORM_LABELS,
        ProductSchema
    } from '$lib/domain/catalog/schemas'
    import { Alert, AlertDescription } from '$lib/domain/ui/alert'
    import { Button } from '$lib/domain/ui/button'
    import * as Dialog from '$lib/domain/ui/dialog'
    import * as Field from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'
    import { ScrollArea } from '$lib/domain/ui/scroll-area'
    import * as Select from '$lib/domain/ui/select'

    type Props = {
        onOpenChange: (open: boolean) => void
        open: boolean
        product?: Product
    }
    const { onOpenChange, open, product }: Props = $props()

    const catalogQuery = useCatalogQuery()
    const createMutation = createProductMutation()
    const editMutation = $derived(updateProductMutation(product?.id))

    const brands = $derived.by(() => {
        if (!catalogQuery.data) {
            return []
        }

        return catalogQuery.data
    })
    const isEditing = $derived(!!product)
    const mutation = $derived(isEditing ? editMutation : createMutation)
    const isPending = $derived(mutation.isPending)

    let brandId = $state('')
    let name = $state('')
    let slug = $state('')
    let form = $state<'' | ProductFormType>('')
    let flavor = $state('')
    let servingSize = $state('')
    let servingUnit = $state('g')
    let servingsPerPackage = $state('')
    let calories = $state('')
    let carbsG = $state('')
    let sugarG = $state('')
    let proteinG = $state('')
    let fatG = $state('')
    let sodiumMg = $state('')
    let caffeineMg = $state('')
    let notes = $state('')
    let errors = $state<Record<string, string>>({})
    let autoSlug = $state(true)

    const parseNumber = (value: string): number | undefined => {
        if (!value) {
            return undefined
        }
        const parsed = Number(value)
        return Number.isNaN(parsed) ? undefined : parsed
    }

    const validate = () => {
        const result = v.safeParse(ProductSchema, {
            brandId,
            caffeineGm: parseNumber(caffeineMg),
            calories: parseNumber(calories),
            carbsG: parseNumber(carbsG),
            fatG: parseNumber(fatG),
            flavor: flavor || undefined,
            form: form || undefined,
            name,
            notes: notes || undefined,
            proteinG: parseNumber(proteinG),
            servingSize: parseNumber(servingSize),
            servingsPerPackage: parseNumber(servingsPerPackage),
            servingUnit,
            slug,
            sodiumMg: parseNumber(sodiumMg),
            sugarG: parseNumber(sugarG)
        })

        if (!result.success) {
            const flatErrors = v.flatten(result.issues)
            errors = Object.fromEntries(
                Object.entries(flatErrors.nested ?? {}).map(([key, value]) => [key, value?.[0] ?? ''])
            )
            return null
        }

        errors = {}
        return result.output
    }

    const submit = async () => {
        const data = validate()
        if (!data) {
            return
        }

        try {
            await mutation.mutateAsync({
                brand_id: data.brandId,
                caffeine_mg: data.caffeineGm ?? null,
                calories: data.calories ?? null,
                carbs_g: data.carbsG ?? null,
                fat_g: data.fatG ?? null,
                flavor: data.flavor ?? null,
                form: data.form,
                name: data.name,
                notes: data.notes ?? null,
                protein_g: data.proteinG ?? null,
                serving_size: data.servingSize,
                serving_unit: data.servingUnit,
                servings_per_package: data.servingsPerPackage ?? null,
                slug: data.slug,
                sodium_mg: data.sodiumMg ?? null,
                sugar_g: data.sugarG ?? null
            })
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to save product:', error)
        }
    }

    const onSlugInput = () => {
        autoSlug = false
    }

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        submit()
    }

    const onSubmitClick = () => {
        submit()
    }

    const onClose = () => {
        onOpenChange(false)
    }

    $effect(() => {
        if (!open) {
            return
        }

        brandId = product?.brand_id ?? ''
        name = product?.name ?? ''
        slug = product?.slug ?? ''
        form = product?.form ?? ''
        flavor = product?.flavor ?? ''
        servingSize = product?.serving_size?.toString() ?? ''
        servingUnit = product?.serving_unit ?? 'g'
        servingsPerPackage = product?.servings_per_package?.toString() ?? ''
        calories = product?.calories?.toString() ?? ''
        carbsG = product?.carbs_g?.toString() ?? ''
        sugarG = product?.sugar_g?.toString() ?? ''
        proteinG = product?.protein_g?.toString() ?? ''
        fatG = product?.fat_g?.toString() ?? ''
        sodiumMg = product?.sodium_mg?.toString() ?? ''
        caffeineMg = product?.caffeine_mg?.toString() ?? ''
        notes = product?.notes ?? ''
        errors = {}
        autoSlug = !product
    })

    $effect(() => {
        if (autoSlug && name) {
            slug = generateSlug(name)
        }
    })
</script>

<Dialog.Root {open} {onOpenChange}>
    <Dialog.Content class="max-h-[90vh] sm:max-w-2xl">
        <Dialog.Header>
            <Dialog.Title>
                {isEditing ? 'Edit Product' : 'Add Product'}
            </Dialog.Title>
            <Dialog.Description>
                {isEditing ? 'Update the product details below.' : 'Fill in the product details below.'}
            </Dialog.Description>
        </Dialog.Header>

        <ScrollArea class="-mx-6 max-h-[60vh] border-y">
            <form class="flex flex-col gap-4 p-6 [&_input]:placeholder:text-sm" onsubmit={onSubmit}>
                <div class="grid grid-cols-2 gap-2 sm:gap-4">
                    <Field.Field data-invalid={!!errors.brandId || undefined}>
                        <Field.Label for="brandId">Brand *</Field.Label>
                        <Select.Root
                            bind:value={brandId}
                            disabled={catalogQuery.isLoading}
                            type="single"
                        >
                            <Select.Trigger class="w-full" id="brandId" aria-invalid={!!errors.brandId}>
                                {brands.find((b) => b.id === brandId)?.name ?? 'Select a brand'}
                            </Select.Trigger>
                            <Select.Content class="max-h-120">
                                {#each brands as brand (brand.id)}
                                    <Select.Item label={brand.name} value={brand.id} />
                                {/each}
                            </Select.Content>
                        </Select.Root>
                        <Field.Error errors={errors.brandId ? [{ message: errors.brandId }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.form || undefined}>
                        <Field.Label for="form">Form *</Field.Label>
                        <Select.Root bind:value={form} type="single">
                            <Select.Trigger class="w-full" id="form" aria-invalid={!!errors.form}>
                                {form ? PRODUCT_FORM_LABELS[form] : 'Select a form'}
                            </Select.Trigger>
                            <Select.Content>
                                {#each ProductFormValues as productForm (productForm)}
                                    <Select.Item label={PRODUCT_FORM_LABELS[productForm]} value={productForm} />
                                {/each}
                            </Select.Content>
                        </Select.Root>
                        <Field.Error errors={errors.form ? [{ message: errors.form }] : undefined} />
                    </Field.Field>
                </div>

                <div class="grid grid-cols-2 gap-2 sm:gap-4">
                    <Field.Field data-invalid={!!errors.name || undefined}>
                        <Field.Label for="name">Name *</Field.Label>
                        <Input
                            bind:value={name}
                            id="name"
                            placeholder="e.g. Beta Fuel Energy Gel"
                            aria-invalid={!!errors.name}
                        />
                        <Field.Error errors={errors.name ? [{ message: errors.name }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.flavor || undefined}>
                        <Field.Label for="flavor">Flavor</Field.Label>
                        <Input
                            bind:value={flavor}
                            id="flavor"
                            placeholder="e.g. Orange"
                            aria-invalid={!!errors.flavor}
                        />
                        <Field.Error errors={errors.flavor ? [{ message: errors.flavor }] : undefined} />
                    </Field.Field>
                </div>

                <Field.Field data-invalid={!!errors.slug || undefined}>
                    <Field.Label for="slug">Slug *</Field.Label>
                    <Input
                        bind:value={slug}
                        id="slug"
                        placeholder="e.g. beta-fuel-energy-gel-orange"
                        oninput={onSlugInput}
                        aria-invalid={!!errors.slug}
                    />
                    <Field.Description>
                        URL-friendly identifier. Auto-generated from name.
                    </Field.Description>
                    <Field.Error errors={errors.slug ? [{ message: errors.slug }] : undefined} />
                </Field.Field>

                <Field.Separator />
                <p class="text-sm font-medium">Serving Information</p>

                <div class="grid grid-cols-3 gap-2 sm:gap-4">
                    <Field.Field data-invalid={!!errors.servingSize || undefined}>
                        <Field.Label for="servingSize">Size *</Field.Label>
                        <Input
                            bind:value={servingSize}
                            id="servingSize"
                            min="0"
                            placeholder="e.g. 60"
                            step="0.1"
                            type="number"
                            aria-invalid={!!errors.servingSize}
                        />
                        <Field.Error errors={errors.servingSize ? [{ message: errors.servingSize }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.servingUnit || undefined}>
                        <Field.Label for="servingUnit">Unit *</Field.Label>
                        <Input
                            bind:value={servingUnit}
                            id="servingUnit"
                            placeholder="e.g. g, ml"
                            aria-invalid={!!errors.servingUnit}
                        />
                        <Field.Error errors={errors.servingUnit ? [{ message: errors.servingUnit }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.servingsPerPackage || undefined}>
                        <Field.Label for="servingsPerPackage">Per Package</Field.Label>
                        <Input
                            bind:value={servingsPerPackage}
                            id="servingsPerPackage"
                            min="1"
                            placeholder="e.g. 1"
                            type="number"
                            aria-invalid={!!errors.servingsPerPackage}
                        />
                        <Field.Error errors={errors.servingsPerPackage ? [{ message: errors.servingsPerPackage }] : undefined} />
                    </Field.Field>
                </div>

                <Field.Separator />

                <p class="text-sm font-medium">Nutrition per Serving</p>
                <div class="grid grid-cols-2 gap-4 gap-x-2 sm:grid-cols-4 sm:gap-x-4">
                    <Field.Field data-invalid={!!errors.calories || undefined}>
                        <Field.Label for="calories">Calories</Field.Label>
                        <Input
                            bind:value={calories}
                            id="calories"
                            min="0"
                            placeholder="kcal"
                            type="number"
                            aria-invalid={!!errors.calories}
                        />
                        <Field.Error errors={errors.calories ? [{ message: errors.calories }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.carbsG || undefined}>
                        <Field.Label for="carbsG">Carbs (g)</Field.Label>
                        <Input
                            bind:value={carbsG}
                            id="carbsG"
                            min="0"
                            placeholder="g"
                            step="0.1"
                            type="number"
                            aria-invalid={!!errors.carbsG}
                        />
                        <Field.Error errors={errors.carbsG ? [{ message: errors.carbsG }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.sugarG || undefined}>
                        <Field.Label for="sugarG">Sugar (g)</Field.Label>
                        <Input
                            bind:value={sugarG}
                            id="sugarG"
                            min="0"
                            placeholder="g"
                            step="0.1"
                            type="number"
                            aria-invalid={!!errors.sugarG}
                        />
                        <Field.Error errors={errors.sugarG ? [{ message: errors.sugarG }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.proteinG || undefined}>
                        <Field.Label for="proteinG">Protein (g)</Field.Label>
                        <Input
                            bind:value={proteinG}
                            id="proteinG"
                            min="0"
                            placeholder="g"
                            step="0.1"
                            type="number"
                            aria-invalid={!!errors.proteinG}
                        />
                        <Field.Error errors={errors.proteinG ? [{ message: errors.proteinG }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.fatG || undefined}>
                        <Field.Label for="fatG">Fat (g)</Field.Label>
                        <Input
                            bind:value={fatG}
                            id="fatG"
                            min="0"
                            placeholder="g"
                            step="0.1"
                            type="number"
                            aria-invalid={!!errors.fatG}
                        />
                        <Field.Error errors={errors.fatG ? [{ message: errors.fatG }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.sodiumMg || undefined}>
                        <Field.Label for="sodiumMg">Sodium (mg)</Field.Label>
                        <Input
                            bind:value={sodiumMg}
                            id="sodiumMg"
                            min="0"
                            placeholder="mg"
                            type="number"
                            aria-invalid={!!errors.sodiumMg}
                        />
                        <Field.Error errors={errors.sodiumMg ? [{ message: errors.sodiumMg }] : undefined} />
                    </Field.Field>

                    <Field.Field data-invalid={!!errors.caffeineMg || undefined}>
                        <Field.Label for="caffeineMg">Caffeine (mg)</Field.Label>
                        <Input
                            bind:value={caffeineMg}
                            id="caffeineMg"
                            min="0"
                            placeholder="mg"
                            type="number"
                            aria-invalid={!!errors.caffeineMg}
                        />
                        <Field.Error errors={errors.caffeineMg ? [{ message: errors.caffeineMg }] : undefined} />
                    </Field.Field>
                </div>

                <Field.Separator />

                <Field.Field data-invalid={!!errors.notes || undefined}>
                    <Field.Label for="notes">Notes</Field.Label>
                    <textarea
                        class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        bind:value={notes}
                        id="notes"
                        placeholder="Additional notes about this product..."
                        rows="2"
                        aria-invalid={!!errors.notes}
                    ></textarea>
                    <Field.Error errors={errors.notes ? [{ message: errors.notes }] : undefined} />
                </Field.Field>

                {#if mutation.error}
                    <Alert variant="destructive">
                        <AlertDescription>
                            {mutation.error.message}
                        </AlertDescription>
                    </Alert>
                {/if}
            </form>
        </ScrollArea>

        <Dialog.Footer class="flex-row justify-end">
            <Button disabled={isPending} variant="ghost" onclick={onClose}>
                Cancel
            </Button>
            <Button
                disabled={isPending}
                type="submit"
                onclick={onSubmitClick}
            >
                {#if isPending}
                    <LoaderCircleIcon class="animate-spin" />
                    Saving...
                {:else}
                    <SaveIcon />
                    {isEditing ? 'Update Product' : 'Add Product'}
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
