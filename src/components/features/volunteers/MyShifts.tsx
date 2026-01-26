import React, { useState, useEffect } from "react";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Card, Tag, Button, EmptyState, Spinner } from "../../common";
import { ConfirmationModal } from "../../common/ConfirmationModal";
import { volunteerService } from "@/services";
import { VolunteerShiftDto, VolunteerShiftStatus, WeekDayLabels } from "@/types";

export const MyShifts: React.FC = () => {
  const [upcomingShifts, setUpcomingShifts] = useState<VolunteerShiftDto[]>([]);
  const [pastShifts, setPastShifts] = useState<VolunteerShiftDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [shiftToCancel, setShiftToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [upcomingResult, pastResult] = await Promise.all([
        volunteerService.getUpcomingShifts(),
        volunteerService.getPastShifts(),
      ]);

      if (upcomingResult.isSuccess && upcomingResult.data) {
        setUpcomingShifts(upcomingResult.data);
      }

      if (pastResult.isSuccess && pastResult.data) {
        setPastShifts(pastResult.data);
      }

      if (!upcomingResult.isSuccess && !pastResult.isSuccess) {
        setError(upcomingResult.errors?.[0] || "Kunde inte hämta pass");
      }
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  // 1. Triggered when user clicks "Avboka" -> Opens Modal
  const requestCancelShift = (shiftId: string) => {
    setShiftToCancel(shiftId);
    setError(null);
    setSuccessMessage(null);
  };

  // 2. Triggered when user clicks "Bekräfta" in Modal
  const handleConfirmCancel = async () => {
    if (!shiftToCancel) return;

    try {
      setIsCancelling(true);
      const result = await volunteerService.cancelShift(shiftToCancel);

      if (result.isSuccess) {
        // Optimistic update: Remove from list immediately
        setUpcomingShifts((prev) => prev.filter((s) => s.id !== shiftToCancel));

        // Show Success Toast
        setSuccessMessage("Passet har avbokats.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.errors?.[0] || "Kunde inte avboka passet");
      }
    } catch (err) {
      console.error("Failed to cancel shift:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setIsCancelling(false);
      setShiftToCancel(null); // Close modal
    }
  };

  const formatTime = (time: string) => time.substring(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar pass...</p>
      </div>
    );
  }

  // Critical Error (Full Page)
  if (error && upcomingShifts.length === 0 && pastShifts.length === 0) {
    return (
      <Card>
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (upcomingShifts.length === 0 && pastShifts.length === 0) {
    return (
      <EmptyState icon={Calendar} title="Inga pass bokade" description="Du har inga volontärpass" />
    );
  }

  return (
    <div className="space-y-8">
      {/* --- INLINE FEEDBACK (Success Toast) --- */}
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-success font-medium">{successMessage}</p>
        </div>
      )}

      {/* --- INLINE FEEDBACK (Error Toast) --- */}
      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-error font-medium">{error}</p>
        </div>
      )}

      {/* Upcoming Shifts */}
      {upcomingShifts.length > 0 && (
        <div>
          <h2 className="mb-4">Kommande Pass</h2>
          <div className="space-y-4">
            {upcomingShifts.map((shift) => (
              <Card key={shift.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      {shift.status === VolunteerShiftStatus.Confirmed && (
                        <Tag variant="success">Bekräftad</Tag>
                      )}
                      {shift.status === VolunteerShiftStatus.Pending && (
                        <Tag variant="warning">Väntande</Tag>
                      )}
                      {shift.status === VolunteerShiftStatus.Cancelled && (
                        <Tag variant="error">Avbokad</Tag>
                      )}
                    </div>

                    <h3 className="mb-2">{shift.venueName || "Okänd plats"}</h3>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                      <Clock size={16} />
                      {shift.nextOccurrenceStartUtc ? (
                        <span className="text-sm">
                          {formatDate(shift.nextOccurrenceStartUtc)},{" "}
                          {formatTime(shift.startTime.toString())} -{" "}
                          {formatTime(shift.endTime.toString())}
                        </span>
                      ) : (
                        <span className="text-sm">
                          {WeekDayLabels[shift.dayOfWeek]} {formatTime(shift.startTime.toString())}{" "}
                          - {formatTime(shift.endTime.toString())}
                        </span>
                      )}
                    </div>

                    {shift.durationHours && (
                      <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                        <Calendar size={16} />
                        <span className="text-sm">{shift.durationHours} timmar</span>
                      </div>
                    )}

                    {shift.notes && (
                      <p className="text-sm text-neutral-secondary italic mt-2">
                        Anteckningar: {shift.notes}
                      </p>
                    )}
                  </div>

                  {/* Cancel Button */}
                  {shift.status !== VolunteerShiftStatus.Cancelled &&
                    shift.status !== VolunteerShiftStatus.Completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => requestCancelShift(shift.id)}
                      >
                        Avboka
                      </Button>
                    )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Shifts */}
      {pastShifts.length > 0 && (
        <div>
          <h2 className="mb-4">Tidigare Pass</h2>
          <div className="space-y-4">
            {pastShifts.map((shift) => (
              <Card key={shift.id} className="opacity-75">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {shift.isAttended ? (
                        <Tag variant="success">Närvarad</Tag>
                      ) : (
                        <Tag variant="neutral">Ej markerad</Tag>
                      )}
                    </div>
                    <h3 className="mb-2">{shift.venueName || "Okänd plats"}</h3>
                    <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                      <Clock size={16} />
                      {shift.nextOccurrenceStartUtc ? (
                        <span className="text-sm">
                          {formatDate(shift.nextOccurrenceStartUtc)},{" "}
                          {formatTime(shift.startTime.toString())} -{" "}
                          {formatTime(shift.endTime.toString())}
                        </span>
                      ) : (
                        <span className="text-sm">
                          {WeekDayLabels[shift.dayOfWeek]} {formatTime(shift.startTime.toString())}{" "}
                          - {formatTime(shift.endTime.toString())}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* --- REUSABLE CONFIRMATION MODAL --- */}
      <ConfirmationModal
        isOpen={!!shiftToCancel}
        onClose={() => setShiftToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Avboka pass"
        message="Är du säker på att du vill avboka detta pass?"
        confirmLabel="Ja, avboka"
        isDestructive={true}
        isLoading={isCancelling}
      />
    </div>
  );
};
