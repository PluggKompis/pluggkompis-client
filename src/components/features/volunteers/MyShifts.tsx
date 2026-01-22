import React, { useState, useEffect } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, Tag, Button, EmptyState, Spinner } from "../../common";
import { volunteerService } from "@/services";
import { VolunteerShiftDto, VolunteerShiftStatus, WeekDayLabels } from "@/types";

export const MyShifts: React.FC = () => {
  const [upcomingShifts, setUpcomingShifts] = useState<VolunteerShiftDto[]>([]);
  const [pastShifts, setPastShifts] = useState<VolunteerShiftDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(localStorage.getItem("user"));
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both upcoming and past shifts in parallel
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

      // Show error if both failed
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

  const handleCancelShift = async (shiftId: string) => {
    if (!confirm("Är du säker på att du vill avboka detta pass?")) {
      return;
    }

    try {
      const result = await volunteerService.cancelShift(shiftId);

      if (result.isSuccess) {
        // Remove from upcoming list
        setUpcomingShifts((prev) => prev.filter((s) => s.id !== shiftId));
      } else {
        alert(result.errors?.[0] || "Kunde inte avboka passet");
      }
    } catch (err) {
      console.error("Failed to cancel shift:", err);
      alert("Ett oväntat fel uppstod");
    }
  };

  const formatTime = (time: string) => {
    // "16:00:00" -> "16:00"
    return time.substring(0, 5);
  };

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

  if (upcomingShifts.length === 0 && pastShifts.length === 0) {
    return (
      <EmptyState icon={Calendar} title="Inga pass bokade" description="Du har inga volontärpass" />
    );
  }

  return (
    <div className="space-y-8">
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

                    {/* Venue Name */}
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

                    {/* Duration */}
                    {shift.durationHours && (
                      <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                        <Calendar size={16} />
                        <span className="text-sm">{shift.durationHours} timmar</span>
                      </div>
                    )}

                    {/* Notes */}
                    {shift.notes && (
                      <p className="text-sm text-neutral-secondary italic mt-2">
                        Anteckningar: {shift.notes}
                      </p>
                    )}
                  </div>

                  {/* Cancel Button - Only for future shifts */}
                  {shift.status !== VolunteerShiftStatus.Cancelled &&
                    shift.status !== VolunteerShiftStatus.Completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelShift(shift.id)}
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

                    {shift.durationHours && (
                      <div className="flex items-center gap-2 text-neutral-secondary">
                        <Calendar size={16} />
                        <span className="text-sm">{shift.durationHours} timmar</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
