<script lang="ts">
    import type { CatalogProduct } from '@carbplan/contracts/catalog'

    import { LoaderCircleIcon, SaveIcon, Trash2Icon } from '@lucide/svelte'

    import AlertDescription from '$lib/domain/ui/alert/alert-description.svelte'
    import Alert from '$lib/domain/ui/alert/alert.svelte'
    import Button from '$lib/domain/ui/button/button.svelte'
    import DialogContent from '$lib/domain/ui/dialog/dialog-content.svelte'
    import DialogDescription from '$lib/domain/ui/dialog/dialog-description.svelte'
    import DialogFooter from '$lib/domain/ui/dialog/dialog-footer.svelte'
    import DialogHeader from '$lib/domain/ui/dialog/dialog-header.svelte'
    import DialogTitle from '$lib/domain/ui/dialog/dialog-title.svelte'
    import DialogRoot from '$lib/domain/ui/dialog/dialog.svelte'
    import ScrollArea from '$lib/domain/ui/scroll-area/scroll-area.svelte'

    import { createProductFormContext } from './context.svelte'
    import DeactivateProductAlert from './deactivate-product-alert.svelte'
    import SectionBasic from './section-basic.svelte'
    import SectionNotes from './section-notes.svelte'
    import SectionNutrition from './section-nutrition.svelte'
    import SectionServing from './section-serving.svelte'

    type Props = {
        open: boolean
        product?: CatalogProduct
        onOpenChange: (open: boolean) => void
    }
    const { onOpenChange, open, product }: Props = $props()

    const context = createProductFormContext(() => ({ onOpenChange, open, product }))

    let showDeactivateConfirm = $state(false)

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault()
        context.submit()
    }

    const onDeactivateConfirm = () => {
        context.deactivate()
        showDeactivateConfirm = false
    }

    const onShowDeactivateDialog = () => {
        showDeactivateConfirm = true
    }
</script>

<DialogRoot {open} {onOpenChange}>
    <DialogContent class="max-h-[90vh] gap-6 sm:max-w-2xl">
        <DialogHeader>
            <DialogTitle>
                {context.isEditing ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
            <DialogDescription>
                {context.isEditing ? 'Update the product details below.' : 'Fill in the product details below.'}
            </DialogDescription>
        </DialogHeader>

        <ScrollArea class="-mx-6 max-h-[60vh] border-y">
            <form class="flex flex-col gap-4 p-6 [&_input]:placeholder:text-sm" onsubmit={onSubmit}>
                <SectionBasic />
                <SectionServing />
                <SectionNutrition />
                <SectionNotes />

                {#if context.error}
                    <Alert variant="destructive">
                        <AlertDescription>
                            {context.error.message}
                        </AlertDescription>
                    </Alert>
                {/if}
            </form>
        </ScrollArea>

        <DialogFooter class="flex-row justify-between">
            {#if context.isEditing}
                <Button
                    class="mr-auto"
                    disabled={context.isPending || context.isDeactivating}
                    variant="destructive"
                    onclick={onShowDeactivateDialog}
                >
                    <Trash2Icon />
                    Deactivate
                </Button>
            {:else}
                <div></div>
            {/if}
            <div class="flex gap-2">
                <Button disabled={context.isPending || context.isDeactivating} variant="ghost" onclick={context.close}>
                    Cancel
                </Button>
                <Button
                    disabled={context.isPending || context.isDeactivating}
                    type="submit"
                    onclick={context.submit}
                >
                    {#if context.isPending}
                        <LoaderCircleIcon class="animate-spin" />
                        Saving...
                    {:else}
                        <SaveIcon />
                        {context.isEditing ? 'Update Product' : 'Add Product'}
                    {/if}
                </Button>
            </div>
        </DialogFooter>
    </DialogContent>
</DialogRoot>

<DeactivateProductAlert bind:open={showDeactivateConfirm} onConfirm={onDeactivateConfirm} />
