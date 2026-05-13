<script lang="ts">
    import FieldError from '$lib/domain/ui/field/field-error.svelte'
    import FieldLabel from '$lib/domain/ui/field/field-label.svelte'
    import FieldSeparator from '$lib/domain/ui/field/field-separator.svelte'
    import FieldRoot from '$lib/domain/ui/field/field.svelte'

    import { getProductFormContext } from './context.svelte'

    const context = getProductFormContext()

    const onNotesInput = (e: Event) => {
        context.updateField('notes', (e.target as HTMLTextAreaElement).value)
    }
</script>

<FieldSeparator />

<FieldRoot data-invalid={!!context.errors.notes || undefined}>
    <FieldLabel for="notes">Notes</FieldLabel>
    <textarea
        class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        id="notes"
        placeholder="Additional notes about this product..."
        rows="2"
        value={context.state.notes}
        oninput={onNotesInput}
        aria-invalid={!!context.errors.notes}
    ></textarea>
    <FieldError errors={context.errors.notes ? [{ message: context.errors.notes }] : undefined} />
</FieldRoot>
