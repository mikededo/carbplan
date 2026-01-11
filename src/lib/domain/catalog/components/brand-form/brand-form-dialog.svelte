<script lang="ts">
    import type { CatalogBrand } from '$lib/domain/catalog/queries'

    import { LoaderCircleIcon, SaveIcon } from '@lucide/svelte'

    import { Alert, AlertDescription } from '$lib/domain/ui/alert'
    import { Button } from '$lib/domain/ui/button'
    import * as Dialog from '$lib/domain/ui/dialog'

    import BrandFormFields from './brand-form-fields.svelte'
    import { createBrandFormContext } from './context.svelte'

    type Props = {
        onOpenChange: (open: boolean) => void
        open: boolean
        brand?: CatalogBrand
    }
    const { brand, onOpenChange, open }: Props = $props()

    const state = createBrandFormContext(() => ({ brand, onOpenChange, open }))

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        state.submit()
    }
</script>

<Dialog.Root {open} {onOpenChange}>
    <Dialog.Content class="max-h-[90vh] sm:max-w-lg">
        <Dialog.Header>
            <Dialog.Title>{state.isEditing ? 'Edit Brand' : 'Add Brand'}</Dialog.Title>
            <Dialog.Description>
                {state.isEditing ? 'Update the brand details below.' : 'Fill in the brand details below.'}
            </Dialog.Description>
        </Dialog.Header>

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

        <Dialog.Footer>
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
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
