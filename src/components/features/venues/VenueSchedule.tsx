import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Card, Button, Tag, Spinner, SubjectTag } from "../../common";
import { WeekView } from "../timeslots/WeekView";
import { BookingModal } from "../bookings/BookingModal";
import { Parent, TimeSlotSummary, UserRole } from "@/types";
import { timeSlotService } from "@/services";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VenueScheduleProps {
  venueId: string;
}

// Helper to map Day Name strings (from backend) to JS Date.getDay() indices
// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const dayToIndex: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const VenueSchedule: React.FC<VenueScheduleProps> = ({ venueId }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlotSummary[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [slotToBook, setSlotToBook] = useState<TimeSlotSummary | null>(null);

  // Fetch timeslots for this venue
  const fetchTimeSlots = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await timeSlotService.getVenueTimeSlots(venueId, false);

      if (result.isSuccess && result.data) {
        setTimeSlots(result.data);
      } else {
        setError(result.errors?.join(", ") || "Kunde inte hämta schema");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ett fel uppstod";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Handler for when user is not logged in
  const handleLoginRequired = () => {
    // Save current URL so they can return after login
    navigate("/login", {
      state: { from: `/venues/${venueId}` },
    });
  };

  // Handle booking - check if parent has children
  const handleBookSlot = (slot: TimeSlotSummary) => {
    // If parent has no children, redirect to parent dashboard
    if (user?.role === UserRole.Parent) {
      const parent = user as Parent;
      if (!parent?.children || parent.children.length === 0) {
        navigate("/parent", {
          state: {
            message: "Du måste lägga till minst ett barn innan du kan boka läxhjälp.",
          },
        });
        return;
      }
    }

    // Otherwise, open the booking modal
    setSlotToBook(slot);
    setIsBookingModalOpen(true);
  };

  // Check if parent has children (for helper text)
  const parentHasChildren = (): boolean => {
    if (user?.role === UserRole.Parent) {
      const parent = user as Parent; // Use proper type casting
      return parent?.children && parent.children.length > 0;
    }
    return true;
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // Get week range (Force Monday to be the start of the week)
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // 0=Sun, 1=Mon...

    // Logic: If day is Sunday (0), go back 6 days. Otherwise go back (day - 1).
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedDate);
  const startOfWeek = weekDates[0];
  const endOfWeek = weekDates[6];

  // Helper to compare date strings
  const isDateInCurrentWeek = (dateString: string) => {
    const d = new Date(dateString);
    // Reset times to compare dates purely
    const start = new Date(startOfWeek);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endOfWeek);
    end.setHours(23, 59, 59, 999);
    return d >= start && d <= end;
  };

  // Filter slots for current week
  const availableSlots = timeSlots.filter((slot) => {
    // 1. Must be Open and have spots
    const isOpen = slot.status === "Open" && (slot.availableSpots || 0) > 0;
    if (!isOpen) return false;

    // 2. Date Check
    if (slot.isRecurring) {
      return true;
    } else if (slot.specificDate) {
      // Only show if the specific date is within the selected week
      return isDateInCurrentWeek(slot.specificDate);
    }

    return false;
  });

  // Handle slot click from week view → scroll to list item
  const handleSlotClick = (slotId: string) => {
    setSelectedSlotId(slotId);
    setTimeout(() => {
      const element = document.getElementById(`slot-${slotId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  // Get availability badge variant
  const getAvailabilityVariant = (
    availableSpots: number,
    maxStudents: number
  ): "success" | "warning" | "error" => {
    const percentage = (availableSpots / maxStudents) * 100;
    if (percentage > 50) return "success";
    if (percentage > 20) return "warning";
    return "error";
  };

  // Format date in Swedish
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Capitalize first letter helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error rounded-lg">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Calendar View */}
      <Card>
        {/* Heading first */}
        <h3 className="mb-4">Välj ett pass</h3>

        {/* Buttons below heading */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Föregående vecka</span>
            <span className="sm:hidden">Föreg.</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Nästa vecka</span>
            <span className="sm:hidden">Nästa</span>
            <ChevronRight size={16} />
          </Button>
        </div>

        <WeekView
          timeSlots={timeSlots}
          weekDates={weekDates}
          onSlotClick={handleSlotClick}
          selectedSlotId={selectedSlotId}
        />
      </Card>

      {/* Available Slots List */}
      <div className="space-y-4">
        <h3>Lediga pass denna vecka</h3>

        {availableSlots.length === 0 ? (
          <Card>
            <p className="text-center text-neutral-secondary py-8">Inga lediga pass denna vecka</p>
          </Card>
        ) : (
          availableSlots.map((slot) => {
            let displayDate = new Date();

            if (slot.specificDate) {
              displayDate = new Date(slot.specificDate);
            } else {
              const targetDayIndex = dayToIndex[slot.dayOfWeek];
              const foundDate = weekDates.find((d) => d.getDay() === targetDayIndex);
              if (foundDate) {
                displayDate = foundDate;
              }
            }

            return (
              <Card
                key={slot.id}
                id={`slot-${slot.id}`}
                className={`transition-all ${
                  selectedSlotId === slot.id ? "ring-2 ring-primary" : ""
                }`}
              >
                {/* ✅ MOBILE LAYOUT: Stack vertically */}
                <div className="flex flex-col gap-4 lg:hidden">
                  {/* Date */}
                  <h4 className="font-semibold text-lg">
                    {capitalize(displayDate.toLocaleDateString("sv-SE", { weekday: "long" }))}{" "}
                    {formatDate(displayDate)}
                  </h4>

                  {/* Availability Badge */}
                  <Tag variant={getAvailabilityVariant(slot.availableSpots || 0, slot.maxStudents)}>
                    {slot.availableSpots} {slot.availableSpots === 1 ? "plats" : "platser"} kvar
                  </Tag>

                  {/* Time */}
                  <p className="text-sm text-neutral-secondary">
                    {slot.startTime} - {slot.endTime}
                  </p>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2">
                    {slot.subjects.map((subject, idx) => (
                      <SubjectTag
                        key={idx}
                        name={typeof subject === "string" ? subject : subject.name}
                        icon={typeof subject === "object" ? subject.icon : undefined}
                      />
                    ))}
                  </div>

                  {/* Booking Button - Full Width */}
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleBookSlot(slot)}
                        className="w-full"
                      >
                        Boka pass
                      </Button>
                      {/* Helper text if parent has no children */}
                      {user?.role === UserRole.Parent && !parentHasChildren() && (
                        <p className="text-xs text-error text-center">Lägg till barn först</p>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleLoginRequired}
                      className="w-full"
                    >
                      Logga in för att boka
                    </Button>
                  )}
                </div>

                {/* ✅ DESKTOP LAYOUT: Side by side */}
                <div className="hidden lg:flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-medium">
                        {capitalize(displayDate.toLocaleDateString("sv-SE", { weekday: "long" }))}{" "}
                        {formatDate(displayDate)}
                      </h4>
                      <Tag
                        variant={getAvailabilityVariant(slot.availableSpots || 0, slot.maxStudents)}
                      >
                        {slot.availableSpots} {slot.availableSpots === 1 ? "plats" : "platser"} kvar
                      </Tag>
                    </div>

                    <p className="text-sm text-neutral-secondary mb-3">
                      {slot.startTime} - {slot.endTime}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {slot.subjects.map((subject, idx) => (
                        <SubjectTag
                          key={idx}
                          name={typeof subject === "string" ? subject : subject.name}
                          icon={typeof subject === "object" ? subject.icon : undefined}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Booking Button - Right Side */}
                  <div className="flex flex-col items-end gap-1">
                    {isAuthenticated ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookSlot(slot)}
                          className="whitespace-nowrap"
                        >
                          Boka pass
                        </Button>

                        {user?.role === UserRole.Parent && !parentHasChildren() && (
                          <p className="text-xs text-error">Lägg till barn först</p>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoginRequired}
                        className="whitespace-nowrap"
                      >
                        Logga in för att boka
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && slotToBook && (
        <BookingModal
          timeSlot={slotToBook}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSlotToBook(null);
          }}
          onSuccess={() => {
            fetchTimeSlots();
            setIsBookingModalOpen(false);
            setSlotToBook(null);
            setSelectedSlotId(null);
          }}
        />
      )}
    </div>
  );
};
