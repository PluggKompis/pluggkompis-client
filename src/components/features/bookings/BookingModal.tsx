import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Spinner, SubjectTag } from "../../common";
import { TimeSlotSummary, Parent } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { bookingService } from "@/services";
import { Calendar, Clock } from "lucide-react";

interface BookingModalProps {
  timeSlot: TimeSlotSummary;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ timeSlot, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // If parent, require child selection
  useEffect(() => {
    const parent = user as Parent | undefined;
    if (parent?.children && parent.children.length > 0) {
      setSelectedChildId(parent.children[0].id);
    }
  }, [user]);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const parent = user as Parent | undefined;
      const isParent = parent?.children !== undefined;

      // Validation: Parent must select a child
      if (isParent && !selectedChildId) {
        setError("Välj vilket barn du vill boka för");
        setIsSubmitting(false);
        return;
      }

      // Call booking service
      const result = await bookingService.createBooking(
        timeSlot.id,
        new Date().toISOString().split("T")[0],
        selectedChildId || undefined,
        notes || undefined
      );

      if (result.isSuccess) {
        onSuccess();
      } else {
        setError(result.errors?.join(", ") || "Något gick fel vid bokningen");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const parent = user as Parent | undefined;
  const isParent = parent?.children !== undefined;

  return (
    <Modal isOpen onClose={onClose} title="Boka pass">
      <div className="space-y-4">
        {/* Selected Time Slot Display */}
        <div className="bg-neutral-bg p-4 rounded-lg">
          <h4 className="font-medium mb-3">Valt pass</h4>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-secondary">
              <Calendar size={16} />
              <span>{timeSlot.dayOfWeek}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-secondary">
              <Clock size={16} />
              <span>
                {timeSlot.startTime} - {timeSlot.endTime}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {timeSlot.subjects.map((subject, idx) => (
              <SubjectTag
                key={idx}
                name={typeof subject === "string" ? subject : subject.name}
                icon={typeof subject === "object" ? subject.icon : undefined}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-error/10 border border-error rounded-lg">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Child Selector (Parent Only) */}
        {isParent && parent.children.length > 0 && (
          <Select
            label="Välj barn *"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Välj barn --</option>
            {parent.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} ({child.schoolGrade})
              </option>
            ))}
          </Select>
        )}

        {/* Notes */}
        <Input
          label="Anteckningar (valfritt)"
          placeholder="T.ex. 'Behöver extra hjälp med ekvationer'"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting && <Spinner size="sm" />}
            {isSubmitting ? "Bokar..." : "Bekräfta bokning"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
