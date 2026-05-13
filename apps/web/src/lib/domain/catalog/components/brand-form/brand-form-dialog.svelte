<script lang="ts">
    import type { CatalogBrand } from '$lib/domain/catalog/queries/catalog'

    import { LoaderCircleIcon, SaveIcon } from '@lucide/svelte'

    import AlertDescription from '$lib/domain/ui/alert/alert-description.svelte'
    import Alert from '$lib/domain/ui/alert/alert.svelte'
    import Button from '$lib/domain/ui/button/button.svelte'
    import DialogContent from '$lib/domain/ui/dialog/dialog-content.svelte'
    import DialogDescription from '$lib/domain/ui/dialog/dialog-description.svelte'
    import DialogFooter from '$lib/domain/ui/dialog/dialog-footer.svelte'
    import DialogHeader from '$lib/domain/ui/dialog/dialog-header.svelte'
    import DialogTitle from '$lib/domain/ui/dialog/dialog-title.svelte'
    import DialogRoot from '$lib/domain/ui/dialog/dialog.svelte'

    import BrandFormFields from './brand-form-fields.svelte'
    import { createBrandFormContext } from './context.svelte'

    type Props = {
        open: boolean
        brand?: CatalogBrand
        onOpenChange: (open: boolean) => void
    }
    const { brand, onOpenChange, open }: Props = $props()

    const state = createBrandFormContext(() => ({ brand, onOpenChange, open }))

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        state.submit()
    }
</script>

<DialogRoot {open} {onOpenChange}>
    <DialogContent class="max-h-[90vh] sm:max-w-lg">
        <DialogHeader>
            <DialogTitle>{state.isEditing ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
            <DialogDescription>
                {state.isEditing ? 'Update the brand details below.' : 'Fill in the brand details below.'}
            </DialogDescription>
        </DialogHeader>

        <form class="flex max-h-[60vh] flex-col gap-4" onsubmit={onSubmit}>
            <BrandFormFields />

            {#if state.error}
                <Alert variant="destructive">
                    <AlertDescription>
                        {state.error.message}
                    </AlertDescription>
                </Alert>
            {/if}
        </form>

        <DialogFooter>
            <Button disabled={state.isPending} variant="ghost" onclick={state.close}>
                Cancel
            </Button>
            <Button
                disabled={state.isPending}
                type="submit"
                onclick={state.submit}
            >
                {#if state.isPending}
                    <LoaderCircleIcon class="animate-spin" />
                    Saving...
                {:else}
                    <SaveIcon />
                    {state.isEditing ? 'Update Brand' : 'Add Brand'}
                {/if}
            </Button>
        </DialogFooter>
    </DialogContent>
</DialogRoot>
