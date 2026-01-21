import React, { useState } from "react";
import { MapPin, Calendar, User as UserIcon } from "lucide-react";
import { Card, Button, Tag, SubjectTag } from "@/components/common";
import { Booking, BookingStatus } from "@/types";
import { CancelBookingModal } from "./CancelBookingModal";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess: () => void;
  showChildName?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancelSuccess,
  showChildName = false,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Check if booking can be cancelled (2 hours before session)
  const canCancel = (): boolean => {
    if (booking.status !== BookingStatus.Confirmed) return false;

    const bookingDate = new Date(booking.bookingDate);

    if (booking.timeSlot) {
      const [hours, minutes] = booking.timeSlot.startTime.split(":").map(Number);
      const sessionStart = new Date(bookingDate);
      sessionStart.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const hoursUntilSession = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);

      return hoursUntilSession >= 2;
    }

    return bookingDate > new Date();
  };

  // Get status badge variant
  const getStatusVariant = (status: BookingStatus): "default" | "success" | "error" | "warning" => {
    switch (status) {
      case BookingStatus.Confirmed:
        return "success";
      case BookingStatus.Cancelled:
        return "error";
      case BookingStatus.Attended:
        return "default";
      default:
        return "default";
    }
  };

  // Get Swedish status text
  const getStatusText = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.Confirmed:
        return "Bekräftad";
      case BookingStatus.Cancelled:
        return "Avbokad";
      case BookingStatus.Attended:
        return "Genomförd";
      default:
        return status;
    }
  };

  // Format date and time in Swedish
  const formatDateTime = (): string => {
    const date = new Date(booking.bookingDate);

    if (booking.timeSlot) {
      const dayName = format(date, "EEEE", { locale: sv });
      const dateStr = format(date, "d MMMM", { locale: sv });
      const timeStr = `${booking.timeSlot.startTime.slice(0, 5)} - ${booking.timeSlot.endTime.slice(0, 5)}`;

      return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateStr}, ${timeStr}`;
    }

    return format(date, "EEEE d MMMM", { locale: sv });
  };

  // Format venue location with address and city
  // Falls back gracefully if backend hasn't added these fields yet
  const formatVenueLocation = (): string => {
    const parts: string[] = [];

    if (booking.venueAddress) {
      parts.push(booking.venueAddress);
    }

    if (booking.venueCity) {
      parts.push(booking.venueCity);
    }

    return parts.join(", ") || booking.timeSlot?.venueName || "";
  };

  const cancelEnabled = canCancel();
  const venueLocation = formatVenueLocation();

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <div className="space-y-4">
          {/* Header: Venue name and status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {booking.venueName || booking.timeSlot?.venueName || "Plats"}
              </h3>

              {/* Venue Location (address + city) */}
              {venueLocation && (
                <div className="flex items-center gap-1 text-sm text-neutral-secondary mt-1">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>{venueLocation}</span>
                </div>
              )}
            </div>
            <Tag variant={getStatusVariant(booking.status)}>{getStatusText(booking.status)}</Tag>
          </div>

          {/* Child name (for parent bookings) */}
          {showChildName && booking.childName && (
            <div className="flex items-center gap-2 text-sm">
              <UserIcon size={16} className="text-primary" />
              <span className="font-medium">{booking.childName}</span>
            </div>
          )}

          {/* Date and time */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-primary flex-shrink-0" />
            <span>{formatDateTime()}</span>
          </div>

          {/* Subjects */}
          {booking.timeSlot?.subjects && booking.timeSlot.subjects.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-secondary uppercase mb-2">Ämnen</p>
              <div className="flex flex-wrap gap-2">
                {booking.timeSlot.subjects.map((subject) => (
                  <SubjectTag key={subject.id} name={subject.name} icon={subject.icon} />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="text-sm text-neutral-secondary bg-neutral-bg p-3 rounded-lg">
              <p className="font-semibold mb-1">Anteckning:</p>
              <p>{booking.notes}</p>
            </div>
          )}

          {/* Cancel button - Positioned on the right */}
          {booking.status === BookingStatus.Confirmed && (
            <div className="pt-2 border-t border-neutral-stroke">
              <div className="flex justify-between items-start gap-4">
                {/* Left side: Warning text */}
                <div className="flex-1">
                  {!cancelEnabled && (
                    <p className="text-xs text-neutral-secondary">
                      Du kan inte avboka mindre än 2 timmar innan passet
                    </p>
                  )}
                </div>

                {/* Right side: Cancel button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelModal(true)}
                  disabled={!cancelEnabled}
                  className={
                    !cancelEnabled
                      ? "opacity-50 cursor-not-allowed"
                      : "text-error hover:text-error hover:bg-error/10"
                  }
                  title={
                    !cancelEnabled
                      ? "Du kan inte avboka mindre än 2 timmar innan passet"
                      : "Avboka passet"
                  }
                >
                  Avboka
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        booking={booking}
        onSuccess={onCancelSuccess}
      />
    </>
  );
};
