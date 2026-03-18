<script lang="ts">
    import * as Field from '$lib/domain/ui/field'
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

<Field.Field data-invalid={!!context.errors.name || undefined}>
    <Field.Label for="name">Name *</Field.Label>
    <Input
        id="name"
        placeholder="e.g. Science in Sport"
        value={context.state.name}
        oninput={onNameInput}
        aria-invalid={!!context.errors.name}
    />
    <Field.Error errors={context.errors.name ? [{ message: context.errors.name }] : undefined} />
</Field.Field>

<Field.Field data-invalid={!!context.errors.slug || undefined}>
    <Field.Label for="slug">Slug *</Field.Label>
    <Input
        id="slug"
        placeholder="e.g. science-in-sport"
        value={context.state.slug}
        oninput={onSlugInput}
        aria-invalid={!!context.errors.slug}
    />
    <Field.Description>
        URL-friendly identifier. Auto-generated from name.
    </Field.Description>
    <Field.Error errors={context.errors.slug ? [{ message: context.errors.slug }] : undefined} />
</Field.Field>

<Field.Field data-invalid={!!context.errors.website || undefined}>
    <Field.Label for="website">Website</Field.Label>
    <Input
        id="website"
        placeholder="https://example.com"
        type="url"
        value={context.state.website}
        oninput={onWebsiteInput}
        aria-invalid={!!context.errors.website}
    />
    <Field.Error errors={context.errors.website ? [{ message: context.errors.website }] : undefined} />
</Field.Field>

<Field.Field data-invalid={!!context.errors.logoUrl || undefined}>
    <Field.Label for="logoUrl">Logo URL</Field.Label>
    <Input
        id="logoUrl"
        placeholder="https://example.com/logo.png"
        type="url"
        value={context.state.logoUrl}
        oninput={onLogoUrlInput}
        aria-invalid={!!context.errors.logoUrl}
    />
    <Field.Error errors={context.errors.logoUrl ? [{ message: context.errors.logoUrl }] : undefined} />
</Field.Field>

<Field.Field data-invalid={!!context.errors.description || undefined}>
    <Field.Label for="description">Description</Field.Label>
    <textarea
        class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        id="description"
        placeholder="Brief description of the brand..."
        rows="3"
        value={context.state.description}
        oninput={onDescriptionInput}
        aria-invalid={!!context.errors.description}
    ></textarea>
    <Field.Error errors={context.errors.description ? [{ message: context.errors.description }] : undefined} />
</Field.Field>
