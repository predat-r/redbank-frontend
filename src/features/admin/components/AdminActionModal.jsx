import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';

export function AdminActionModal({ action, mutation, onClose, onConfirm }) {
  if (!action) return null;

  return (
    <Modal
      isOpen
      onClose={mutation.isPending ? undefined : onClose}
      subtitle={action.subtitle}
      title={action.title}
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-neutral-600">{action.message}</p>
        {mutation.isError && <Alert tone="error">{mutation.error.message}</Alert>}
        <div className="flex justify-end gap-3">
          <Button disabled={mutation.isPending} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            loading={mutation.isPending}
            onClick={onConfirm}
            variant={action.variant || 'danger'}
          >
            {action.confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
