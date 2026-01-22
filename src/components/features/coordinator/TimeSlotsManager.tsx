// src/components/features/coordinator/TimeSlotsManager.tsx
import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Spinner } from "../../common";
import { CreateTimeSlotModal } from "./CreateTimeSlotModal";
import { venueService, timeSlotService } from "@/services";
import { TimeSlotSummary, WeekDay, WeekDayLabels, TimeSlotStatus } from "@/types";
import { Clock, Users, AlertCircle, Trash2, Edit, Calendar } from "lucide-react";

export const TimeSlotsManager: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenueAndTimeSlots();
  }, []);

  const fetchVenueAndTimeSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const venueResult = await venueService.getMyVenue();
      if (!venueResult.isSuccess || !venueResult.data) {
        setError("Du har inte skapat en plats än");
        return;
      }

      const fetchedVenueId = venueResult.data.id;
      setVenueId(fetchedVenueId);

      const timeSlotsResult = await timeSlotService.getVenueTimeSlots(fetchedVenueId, false);

      if (timeSlotsResult.isSuccess && timeSlotsResult.data) {
        setTimeSlots(timeSlotsResult.data);
      }
    } catch (err) {
      console.error("Failed to fetch venue/timeslots:", err);
      setError("Kunde inte hämta tidspass");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchVenueAndTimeSlots();
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (!confirm("Är du säker på att du vill radera detta tidspass?")) {
      return;
    }

    try {
      const result = await timeSlotService.deleteTimeSlot(id);
      if (result.isSuccess) {
        fetchVenueAndTimeSlots();
      } else {
        alert(result.errors?.[0] || "Kunde inte radera tidspasset");
      }
    } catch (err) {
      console.error("Failed to delete timeslot:", err);
      alert("Ett oväntat fel uppstod");
    }
  };

  // Separate recurring and one-time slots
  const recurringSlots = timeSlots.filter((slot) => slot.isRecurring);
  const oneTimeSlots = timeSlots
    .filter((slot) => !slot.isRecurring)
    .sort((a, b) => {
      // Sort by date
      if (!a.specificDate || !b.specificDate) return 0;
      return new Date(a.specificDate).getTime() - new Date(b.specificDate).getTime();
    });

  // Group recurring slots by day of week
  const groupedRecurringSlots = recurringSlots.reduce(
    (acc, slot) => {
      const day = slot.dayOfWeek as WeekDay;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(slot);
      return acc;
    },
    {} as Record<WeekDay, TimeSlotSummary[]>
  );

  const dayOrder: WeekDay[] = [
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
    WeekDay.Friday,
    WeekDay.Saturday,
    WeekDay.Sunday,
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar tidspass...</p>
      </div>
    );
  }

  if (error && !venueId) {
    return (
      <Card>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-neutral-secondary mb-4" />
          <p className="text-neutral-secondary mb-4">{error}</p>
          <p className="text-sm text-neutral-secondary">
            Gå till fliken "Min Plats" för att skapa din plats först
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Hantera Tidspass</h2>
          <p className="text-sm text-neutral-secondary mt-1">
            Skapa och hantera återkommande och engångspass
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          disabled={!venueId}
        >
          + Skapa nytt pass
        </Button>
      </div>

      {/* Empty State */}
      {timeSlots.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-neutral-secondary mb-4" />
            <p className="text-neutral-secondary mb-2">Inga tidspass än</p>
            <p className="text-sm text-neutral-secondary mb-4">
              Skapa ditt första tidspass för att komma igång
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              + Skapa nytt pass
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Recurring Slots */}
          {recurringSlots.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-primary" />
                <h3>Återkommande Pass</h3>
                <Tag variant="neutral">{recurringSlots.length}</Tag>
              </div>
              <div className="space-y-6">
                {dayOrder.map((day) => {
                  const slots = groupedRecurringSlots[day];
                  if (!slots || slots.length === 0) return null;

                  return (
                    <div key={day}>
                      <h4 className="font-semibold text-primary mb-3">{WeekDayLabels[day]}ar</h4>
                      <div className="space-y-3">
                        {slots.map((slot) => (
                          <TimeSlotCard
                            key={slot.id}
                            timeSlot={slot}
                            onDelete={handleDeleteTimeSlot}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* One-Time Slots */}
          {oneTimeSlots.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-primary" />
                <h3>Engångspass</h3>
                <Tag variant="neutral">{oneTimeSlots.length}</Tag>
              </div>
              <div className="space-y-3">
                {oneTimeSlots.map((slot) => (
                  <TimeSlotCard
                    key={slot.id}
                    timeSlot={slot}
                    onDelete={handleDeleteTimeSlot}
                    showFullDate // Show full date for one-time slots
                  />
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Create Modal */}
      {showCreateModal && venueId && (
        <CreateTimeSlotModal
          venueId={venueId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

// TimeSlot Card Component
interface TimeSlotCardProps {
  timeSlot: TimeSlotSummary;
  onDelete: (id: string) => void;
  showFullDate?: boolean; // For one-time slots
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  timeSlot,
  onDelete,
  showFullDate = false,
}) => {
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const availableSpots = timeSlot.maxStudents - timeSlot.currentBookings;
  const utilizationPercent = (timeSlot.currentBookings / timeSlot.maxStudents) * 100;

  return (
    <div className="flex items-start gap-4 p-4 bg-neutral-bg rounded-lg border border-neutral-stroke hover:border-primary/30 transition-colors">
      <div className="flex-1">
        {/* Time & Status */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <p className="font-semibold">
              {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
            </p>
          </div>
          {timeSlot.status === TimeSlotStatus.Cancelled ? (
            <Tag variant="error">Inställd</Tag>
          ) : (
            <Tag variant="success">Aktiv</Tag>
          )}
          {/* Show date for one-time slots */}
          {showFullDate && timeSlot.specificDate && (
            <Tag variant="neutral">
              {new Date(timeSlot.specificDate).toLocaleDateString("sv-SE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Tag>
          )}
        </div>

        {/* Bookings */}
        <div className="flex items-center gap-4 mb-3 text-sm text-neutral-secondary">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>
              {timeSlot.currentBookings}/{timeSlot.maxStudents} bokade
            </span>
            <span
              className={`ml-1 ${
                utilizationPercent > 80
                  ? "text-warning"
                  : utilizationPercent === 100
                    ? "text-error"
                    : "text-success"
              }`}
            >
              ({availableSpots} platser kvar)
            </span>
          </div>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-2">
          {timeSlot.subjects.map((subject) => (
            <Tag key={subject.id} variant="subject" icon={subject.icon}>
              {subject.name}
            </Tag>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert("Edit modal coming soon!")}
          disabled={timeSlot.status === TimeSlotStatus.Cancelled}
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(timeSlot.id)}
          disabled={timeSlot.status === TimeSlotStatus.Cancelled}
          className="hover:border-error hover:text-error"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};
