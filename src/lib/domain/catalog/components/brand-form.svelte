<script lang="ts">
    import type { CatalogBrand } from '$lib/domain/catalog/queries'

    import { LoaderCircleIcon, SaveIcon } from '@lucide/svelte'
    import * as v from 'valibot'

    import { createBrandMutation, updateBrandMutation } from '$lib/domain/catalog/queries'
    import { BrandSchema, generateSlug } from '$lib/domain/catalog/schemas'
    import { Alert, AlertDescription } from '$lib/domain/ui/alert'
    import { Button } from '$lib/domain/ui/button'
    import * as Dialog from '$lib/domain/ui/dialog'
    import { Input } from '$lib/domain/ui/input'
    import { Label } from '$lib/domain/ui/label'

    type Props = {
        onOpenChange: (open: boolean) => void
        open: boolean
        brand?: CatalogBrand
    }
    const { brand, onOpenChange, open }: Props = $props()

    const isEditing = $derived(!!brand)
    const createMutation = createBrandMutation()
    const editMutation = $derived(updateBrandMutation(brand?.id))
    const mutation = $derived(isEditing ? editMutation : createMutation)
    const isPending = $derived(mutation.isPending)

    let name = $state('')
    let slug = $state('')
    let logoUrl = $state('')
    let website = $state('')
    let description = $state('')
    let errors = $state<Record<string, string>>({})
    let autoSlug = $state(true)

    const validate = () => {
        const result = v.safeParse(BrandSchema, {
            description: description || undefined,
            logoUrl: logoUrl || undefined,
            name,
            slug,
            website: website || undefined
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
                description: data.description ?? null,
                logo_url: data.logoUrl ?? null,
                name: data.name,
                slug: data.slug,
                website: data.website ?? null
            })
            onOpenChange(false)
        } catch (error) {
            // Error will be shown via mutation.error
            console.error('Failed to save brand:', error)
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
        if (open) {
            name = brand?.name ?? ''
            slug = brand?.slug ?? ''
            logoUrl = brand?.logo_url ?? ''
            website = brand?.website ?? ''
            description = brand?.description ?? ''
            errors = {}
            autoSlug = !brand
        }
    })

    $effect(() => {
        if (autoSlug && name) {
            slug = generateSlug(name)
        }
    })
</script>

<Dialog.Root {open} {onOpenChange}>
    <Dialog.Content class="max-h-[90vh] sm:max-w-lg">
        <Dialog.Header>
            <Dialog.Title>{isEditing ? 'Edit Brand' : 'Add Brand'}</Dialog.Title>
            <Dialog.Description>
                {isEditing ? 'Update the brand details below.' : 'Fill in the brand details below.'}
            </Dialog.Description>
        </Dialog.Header>

        <form class="flex max-h-[60vh] flex-col gap-4" onsubmit={onSubmit}>
            <div class="space-y-2">
                <Label for="name">Name *</Label>
                <Input
                    bind:value={name}
                    id="name"
                    placeholder="e.g. Science in Sport"
                    aria-invalid={!!errors.name}
                />
                {#if errors.name}
                    <p class="text-sm text-destructive">{errors.name}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="slug">Slug *</Label>
                <Input
                    bind:value={slug}
                    id="slug"
                    placeholder="e.g. science-in-sport"
                    oninput={onSlugInput}
                    aria-invalid={!!errors.slug}
                />
                <p class="text-xs text-muted-foreground">
                    URL-friendly identifier. Auto-generated from name.
                </p>
                {#if errors.slug}
                    <p class="text-sm text-destructive">{errors.slug}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="website">Website</Label>
                <Input
                    bind:value={website}
                    id="website"
                    placeholder="https://example.com"
                    type="url"
                    aria-invalid={!!errors.website}
                />
                {#if errors.website}
                    <p class="text-sm text-destructive">{errors.website}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="logoUrl">Logo URL</Label>
                <Input
                    bind:value={logoUrl}
                    id="logoUrl"
                    placeholder="https://example.com/logo.png"
                    type="url"
                    aria-invalid={!!errors.logoUrl}
                />
                {#if errors.logoUrl}
                    <p class="text-sm text-destructive">{errors.logoUrl}</p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="description">Description</Label>
                <textarea
                    class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    bind:value={description}
                    id="description"
                    placeholder="Brief description of the brand..."
                    rows="3"
                    aria-invalid={!!errors.description}
                ></textarea>
                {#if errors.description}
                    <p class="text-sm text-destructive">{errors.description}</p>
                {/if}
            </div>

            {#if mutation.error}
                <Alert variant="destructive">
                    <AlertDescription>
                        {mutation.error.message}
                    </AlertDescription>
                </Alert>
            {/if}
        </form>

        <Dialog.Footer>
            <Button disabled={isPending} variant="outline" onclick={onClose}>
                Cancel
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
                    {isEditing ? 'Update Brand' : 'Add Brand'}
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
