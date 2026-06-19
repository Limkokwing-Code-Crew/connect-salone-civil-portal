import { Modal } from "@/components/Modal";
import { Lock } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  onSignIn: () => void;
}

export function LoginPromptModal({
  isOpen,
  onClose,
  featureName,
  onSignIn,
}: LoginPromptModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={() => onClose()} title="Sign In Required">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock size={20} className="text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            Please sign in to access {featureName}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSignIn}
            className="btn-primary flex-1"
          >
            Sign In
          </button>
        </div>
      </div>
    </Modal>
  );
}
