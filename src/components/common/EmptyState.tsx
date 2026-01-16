import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="w-24 h-24 mx-auto mb-6 bg-neutral-bg rounded-full flex items-center justify-center">
        <Icon size={48} className="text-neutral-secondary" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
};
