import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "@/components/common";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { User, Edit2, Trash2, Calendar } from "lucide-react";
import { Child } from "@/types";

interface ChildCardProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (childId: string) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBookSession = () => {
    navigate("/venues", { state: { selectedChildId: child.id } });
  };

  const handleConfirmDelete = () => {
    onDelete(child.id);
    setShowDeleteConfirm(false);
  };

  const currentYear = new Date().getFullYear();
  const age = currentYear - child.birthYear;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{child.firstName}</h3>
              <p className="text-sm text-neutral-secondary">
                {age} år • Årskurs: {child.schoolGrade}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookSession}
              className="w-full flex items-center justify-center gap-2"
            >
              <Calendar size={16} />
              Boka läxhjälp
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(child)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Edit2 size={14} />
                Redigera
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 text-error hover:text-error hover:bg-error/10 border-neutral-stroke hover:border-error"
              >
                <Trash2 size={14} />
                Ta bort
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Ta bort barn"
        message={`Är du säker på att du vill ta bort ${child.firstName}? Detta går inte om barnet har aktiva bokningar.`}
        confirmLabel="Ta bort"
        isDestructive={true}
      />
    </>
  );
};
