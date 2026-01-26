import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Spinner, SubjectTag } from "../../common";
import { TimeSlotSummary, Parent, UserRole } from "@/types";
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
  const [success, setSuccess] = useState(false); // ← Added

  // If parent, require child selection
  useEffect(() => {
    const parent = user as Parent | undefined;
    if (parent?.children && parent.children.length > 0) {
      setSelectedChildId(parent.children[0].id);
    }
  }, [user]);

  // Helper: Get next occurrence of a recurring slot
  const getNextOccurrence = (dayOfWeek: string): string => {
    const today = new Date();
    const targetDay = dayOfWeekToNumber(dayOfWeek);
    const currentDay = today.getDay();

    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTarget);

    return nextDate.toISOString().split("T")[0];
  };

  // Helper: Convert day name to JS day number
  const dayOfWeekToNumber = (dayName: string): number => {
    const dayMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayMap[dayName] ?? 1;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false); // ← Reset
    setIsSubmitting(true);

    try {
      const parent = user as Parent | undefined;
      const isParent = user?.role === UserRole.Parent;

      // Validation: Parent must have children registered first
      if (isParent && (!parent?.children || parent.children.length === 0)) {
        setError(
          "Du måste lägga till minst ett barn innan du kan boka. Gå till 'Mina Barn' i din föräldrapanel."
        );
        setIsSubmitting(false);
        return;
      }

      // Validation: Parent must select a child
      if (isParent && !selectedChildId) {
        setError("Välj vilket barn du vill boka för");
        setIsSubmitting(false);
        return;
      }

      // Calculate the correct booking date
      let bookingDate: string;
      if (timeSlot.specificDate) {
        bookingDate = timeSlot.specificDate.split("T")[0];
      } else {
        bookingDate = getNextOccurrence(timeSlot.dayOfWeek);
      }

      console.log("📅 Booking date:", bookingDate);

      // Call booking service
      const result = await bookingService.createBooking(
        timeSlot.id,
        bookingDate,
        selectedChildId || undefined,
        notes || undefined
      );

      if (result.isSuccess) {
        setSuccess(true); // ← Show success

        // Wait to show success, then close
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
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
              {timeSlot.specificDate && (
                <span className="text-primary font-medium">
                  ({new Date(timeSlot.specificDate).toLocaleDateString("sv-SE")})
                </span>
              )}
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

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-success/10 border border-success rounded-lg">
            <p className="text-success text-sm font-medium">✓ Bokningen lyckades!</p>
          </div>
        )}

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
            disabled={isSubmitting || success} // ← Disable on success
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
          disabled={isSubmitting || success} // ← Disable on success
        />

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting || success}>
            {success ? "Stäng" : "Avbryt"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || success}
            className="flex items-center gap-2"
          >
            {isSubmitting && <Spinner size="sm" />}
            {success ? "✓ Bokad!" : isSubmitting ? "Bokar..." : "Bekräfta bokning"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
