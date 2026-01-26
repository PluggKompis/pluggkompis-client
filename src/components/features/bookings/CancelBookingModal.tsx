import React, { useState } from "react";
import { AlertCircle, Calendar, MapPin } from "lucide-react";
import { Modal, Button, Spinner } from "@/components/common";
import { Booking } from "@/types";
import { bookingService } from "@/services";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess: () => void;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format date in Swedish
  const formatDate = (): string => {
    const date = new Date(booking.bookingDate);

    if (booking.timeSlot) {
      const dayName = format(date, "EEEE", { locale: sv });
      const dateStr = format(date, "d MMMM", { locale: sv });
      const timeStr = `${booking.timeSlot.startTime.slice(0, 5)} - ${booking.timeSlot.endTime.slice(0, 5)}`;

      return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateStr}, ${timeStr}`;
    }

    return format(date, "EEEE d MMMM", { locale: sv });
  };

  // Handle cancel booking
  const handleCancel = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await bookingService.cancelBooking(booking.id);

      if (result.isSuccess) {
        onSuccess();
        onClose();
      } else {
        setError(result.errors?.[0] || "Kunde inte avboka passet. Försök igen.");
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError("Ett oväntat fel uppstod. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Avboka pass" size="md">
      <div className="space-y-6">
        {/* Warning message */}
        <div className="p-4 bg-warning/10 border border-warning rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning">Är du säker?</p>
            <p className="text-sm text-neutral-secondary mt-1">
              Denna åtgärd kan inte ångras. Platsen blir tillgänglig för andra att boka.
            </p>
          </div>
        </div>

        {/* Booking details */}
        <div className="space-y-3 bg-neutral-bg p-4 rounded-lg">
          <h4 className="font-semibold">Bokningsdetaljer</h4>

          {/* Venue */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                {booking.venueName || booking.timeSlot?.venueName || "Plats"}
              </p>
            </div>
          </div>

          {/* Date and time */}
          <div className="flex items-start gap-2 text-sm">
            <Calendar size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <p>{formatDate()}</p>
          </div>

          {/* Child name */}
          {booking.childName && (
            <div className="text-sm">
              <p className="text-neutral-secondary">För:</p>
              <p className="font-medium">{booking.childName}</p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-error/10 border border-error rounded-lg">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Nej, behåll bokningen
          </Button>
          <Button
            variant="primary"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-error hover:bg-error/90"
          >
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            {isSubmitting ? "Avbokar..." : "Ja, avboka"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
