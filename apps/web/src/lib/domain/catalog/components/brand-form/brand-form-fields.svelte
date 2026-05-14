<script lang="ts">
    import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '$lib/domain/ui/field'
    import { Input } from '$lib/domain/ui/input'

    import { getBrandFormContext } from './context.svelte'

    const context = getBrandFormContext()

    const onNameInput = (e: Event) => {
        context.updateField('name', (e.target as HTMLInputElement).value)
    }

    const onSlugInput = (e: Event) => {
        context.disableAutoSlug()
        context.updateField('slug', (e.target as HTMLInputElement).value)
    }

    const onWebsiteInput = (e: Event) => {
        context.updateField('website', (e.target as HTMLInputElement).value)
    }

    const onLogoUrlInput = (e: Event) => {
        context.updateField('logoUrl', (e.target as HTMLInputElement).value)
    }

    const onDescriptionInput = (e: Event) => {
        context.updateField('description', (e.target as HTMLTextAreaElement).value)
    }
</script>

<FieldRoot data-invalid={!!context.errors.name || undefined}>
    <FieldLabel for="name">Name *</FieldLabel>
    <Input
        id="name"
        placeholder="e.g. Science in Sport"
        value={context.state.name}
        oninput={onNameInput}
        aria-invalid={!!context.errors.name}
    />
    <FieldError errors={context.errors.name ? [{ message: context.errors.name }] : undefined} />
</FieldRoot>

<FieldRoot data-invalid={!!context.errors.slug || undefined}>
    <FieldLabel for="slug">Slug *</FieldLabel>
    <Input
        id="slug"
        placeholder="e.g. science-in-sport"
        value={context.state.slug}
        oninput={onSlugInput}
        aria-invalid={!!context.errors.slug}
    />
    <FieldDescription>
        URL-friendly identifier. Auto-generated from name.
    </FieldDescription>
    <FieldError errors={context.errors.slug ? [{ message: context.errors.slug }] : undefined} />
</FieldRoot>

<FieldRoot data-invalid={!!context.errors.website || undefined}>
    <FieldLabel for="website">Website</FieldLabel>
    <Input
        id="website"
        placeholder="https://example.com"
        type="url"
        value={context.state.website}
        oninput={onWebsiteInput}
        aria-invalid={!!context.errors.website}
    />
    <FieldError errors={context.errors.website ? [{ message: context.errors.website }] : undefined} />
</FieldRoot>

<FieldRoot data-invalid={!!context.errors.logoUrl || undefined}>
    <FieldLabel for="logoUrl">Logo URL</FieldLabel>
    <Input
        id="logoUrl"
        placeholder="https://example.com/logo.png"
        type="url"
        value={context.state.logoUrl}
        oninput={onLogoUrlInput}
        aria-invalid={!!context.errors.logoUrl}
    />
    <FieldError errors={context.errors.logoUrl ? [{ message: context.errors.logoUrl }] : undefined} />
</FieldRoot>

<FieldRoot data-invalid={!!context.errors.description || undefined}>
    <FieldLabel for="description">Description</FieldLabel>
    <textarea
        class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        id="description"
        placeholder="Brief description of the brand..."
        rows="3"
        value={context.state.description}
        oninput={onDescriptionInput}
        aria-invalid={!!context.errors.description}
    ></textarea>
    <FieldError errors={context.errors.description ? [{ message: context.errors.description }] : undefined} />
</FieldRoot>
