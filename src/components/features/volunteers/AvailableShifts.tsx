import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, AlertCircle, Users } from "lucide-react";
import { Card, Tag, Button, EmptyState, Spinner } from "../../common";
import { volunteerService } from "@/services";
import { AvailableShiftDto, WeekDayLabels } from "@/types";

export const AvailableShifts: React.FC = () => {
  const [shifts, setShifts] = useState<AvailableShiftDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState<string | null>(null);
  const [confirmingShift, setConfirmingShift] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableShifts();
  }, []);

  const fetchAvailableShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await volunteerService.getAvailableShifts();

      if (result.isSuccess && result.data) {
        setShifts(result.data);
      } else {
        setError(result.errors?.[0] || "Kunde inte hämta lediga pass");
      }
    } catch (err) {
      console.error("Failed to fetch available shifts:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (timeSlotId: string, venueName: string) => {
    try {
      setSigningUp(timeSlotId);
      setSuccessMessage(null);
      setError(null);

      const result = await volunteerService.signUpForShift({ timeSlotId });

      if (result.isSuccess) {
        // Remove from available shifts list
        setShifts((prev) => prev.filter((s) => s.timeSlotId !== timeSlotId));

        // Show success message
        setSuccessMessage(`Du har anmält dig till passet på ${venueName}!`);

        // Hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.errors?.[0] || "Kunde inte anmäla dig till passet");
      }
    } catch (err) {
      console.error("Failed to sign up for shift:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setSigningUp(null);
    }
  };

  const formatTime = (time: string) => {
    // "16:00:00" -> "16:00"
    return time.substring(0, 5);
  };

  const formatDate = (dateString: string) => {
    // "2026-01-21" -> "21 januari 2026"
    return new Date(dateString).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShiftDate = (shift: AvailableShiftDto) => {
    if (shift.specificDate) {
      // One-time shift: "Tisdag 21 januari 2026, 16:00-18:00"
      const date = new Date(shift.specificDate);
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      return `${capitalizedWeekday} ${formatDate(shift.specificDate)}, ${formatTime(shift.startTime)}-${formatTime(shift.endTime)}`;
    } else {
      // Recurring: "Varje tisdag, 16:00-18:00"
      return `Varje ${WeekDayLabels[shift.dayOfWeek].toLowerCase()}, ${formatTime(shift.startTime)}-${formatTime(shift.endTime)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar lediga pass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (shifts.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="Inga lediga pass"
        description="Det finns inga lediga pass att anmäla sig till just nu. Kontrollera igen senare!"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Tillgängliga Pass</h2>
        <p className="text-sm text-neutral-secondary">
          Pass på platser där din ansökan har godkänts
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-3 bg-success/10 border border-success rounded-lg">
          <p className="text-success text-sm font-medium">✓ {successMessage}</p>
        </div>
      )}

      <div className="space-y-4">
        {shifts.map((shift) => (
          <Card key={shift.timeSlotId}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Venue Name */}
                <h3 className="mb-3">{shift.venueName}</h3>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                  <Clock size={16} />
                  <span className="text-sm">{formatShiftDate(shift)}</span>
                </div>

                {/* Location */}
                {(shift.venueCity || shift.venueAddress) && (
                  <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                    <MapPin size={16} />
                    <span className="text-sm">
                      {shift.venueAddress && shift.venueCity
                        ? `${shift.venueAddress}, ${shift.venueCity}`
                        : shift.venueCity || shift.venueAddress}
                    </span>
                  </div>
                )}

                {/* Capacity (if provided) */}
                {shift.volunteersNeeded !== null &&
                  shift.volunteersNeeded !== undefined &&
                  shift.volunteersSignedUp !== null &&
                  shift.volunteersSignedUp !== undefined && (
                    <div className="flex items-center gap-2 text-neutral-secondary mb-3">
                      <Users size={16} />
                      <span className="text-sm">
                        {shift.volunteersSignedUp} / {shift.volunteersNeeded} volontärer anmälda
                      </span>
                    </div>
                  )}

                {/* Subjects */}
                {shift.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {shift.subjects.map((subject, idx) => (
                      <Tag key={idx} variant="subject">
                        {subject}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign Up Button or Confirmation */}
              {confirmingShift === shift.timeSlotId ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setConfirmingShift(null);
                      handleSignUp(shift.timeSlotId, shift.venueName);
                    }}
                    disabled={signingUp === shift.timeSlotId}
                  >
                    {signingUp === shift.timeSlotId ? "Anmäler..." : "Bekräfta"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmingShift(null)}
                    disabled={signingUp === shift.timeSlotId}
                  >
                    Avbryt
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setConfirmingShift(shift.timeSlotId)}
                >
                  Anmäl dig till pass
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
