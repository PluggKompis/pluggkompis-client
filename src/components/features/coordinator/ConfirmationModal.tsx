import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/common";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean; // If true, make the button red
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Bekräfta",
  isDestructive = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-neutral-stroke flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {isDestructive && <AlertTriangle className="text-error" size={24} />}
            {title}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-secondary hover:text-neutral-primary"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-neutral-primary">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            Avbryt
          </Button>
          <Button
            variant="primary" // You can create a 'destructive' variant in your Button component later
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${isDestructive ? "bg-error hover:bg-error/90 border-error" : ""}`}
          >
            {isLoading ? "Bearbetar..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
