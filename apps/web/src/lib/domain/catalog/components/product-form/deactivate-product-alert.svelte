<script lang="ts">
    import { LoaderCircleIcon } from '@lucide/svelte'

    import * as AlertDialog from '$lib/domain/ui/alert-dialog'
    import { Button } from '$lib/domain/ui/button'

    import { getProductFormContext } from './context.svelte'

    type Props = {
        open: boolean
        onConfirm: () => void
    }
    let { onConfirm, open = $bindable(false) }: Props = $props()

    const context = getProductFormContext()

    const onCloseDialog = () => {
        open = false
    }
</script>

<AlertDialog.Root bind:open>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Deactivate Product</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure you want to deactivate this product? It will no longer appear in the catalog, but historical data will be preserved.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel onclick={onCloseDialog}>Cancel</AlertDialog.Cancel>
            <Button
                disabled={context.isDeactivating}
                variant="destructive"
                onclick={onConfirm}
            >
                {#if context.isDeactivating}
                    <LoaderCircleIcon class="animate-spin" />
                    Deactivating...
                {:else}
                    Deactivate
                {/if}
            </Button>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
