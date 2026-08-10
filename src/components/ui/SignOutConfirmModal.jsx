import { LogOut } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const SignOutConfirmModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center space-y-4 pt-1">
        <div className="w-12 h-12 rounded-full bg-error-50 text-error-600 flex items-center justify-center mx-auto shadow-xs">
          <LogOut className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-neutral-800">Confirm Sign Out</h3>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Are you sure you want to sign out of your RedBank account session?
          </p>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 justify-center text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            className="w-1/2 justify-center text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};
