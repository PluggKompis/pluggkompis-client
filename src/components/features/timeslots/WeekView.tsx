import React from "react";
import { TimeSlotSummary, TimeSlotStatus, WeekDay } from "@/types";
import { CheckCircle, AlertCircle } from "lucide-react";

interface WeekViewProps {
  timeSlots: TimeSlotSummary[];
  weekDates: Date[];
  onSlotClick: (slotId: string) => void;
  selectedSlotId: string | null;
}

// STANDARD MAPPING (Matches C# and JS Date.getDay())
// 0 is always Sunday, 1 is Monday, 2 is Tuesday, etc.
const dayMap: Record<number, WeekDay> = {
  0: WeekDay.Sunday,
  1: WeekDay.Monday,
  2: WeekDay.Tuesday,
  3: WeekDay.Wednesday,
  4: WeekDay.Thursday,
  5: WeekDay.Friday,
  6: WeekDay.Saturday,
};

const dayLabels: Record<WeekDay, string> = {
  [WeekDay.Monday]: "Mån",
  [WeekDay.Tuesday]: "Tis",
  [WeekDay.Wednesday]: "Ons",
  [WeekDay.Thursday]: "Tor",
  [WeekDay.Friday]: "Fre",
  [WeekDay.Saturday]: "Lör",
  [WeekDay.Sunday]: "Sön",
};

export const WeekView: React.FC<WeekViewProps> = ({
  timeSlots,
  weekDates,
  onSlotClick,
  selectedSlotId,
}) => {
  // Helper: Compare dates ignoring time
  const isSameDate = (dateObj: Date, dateString?: string) => {
    if (!dateString) return false;
    const d2 = new Date(dateString);
    return (
      dateObj.getFullYear() === d2.getFullYear() &&
      dateObj.getMonth() === d2.getMonth() &&
      dateObj.getDate() === d2.getDate()
    );
  };

  // Group slots by Day Enum
  const slotsByDay = timeSlots.reduce(
    (acc, slot) => {
      // DEFAULT: Trust the DayOfWeek from backend (e.g., 2 = Tuesday)
      let key = slot.dayOfWeek;

      // OVERRIDE: If specific date exists, recalculate to be safe
      if (!slot.isRecurring && slot.specificDate) {
        const d = new Date(slot.specificDate);
        key = dayMap[d.getDay()]; // d.getDay() returns 2 for Tuesday, maps to WeekDay.Tuesday
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    },
    {} as Record<WeekDay, TimeSlotSummary[]>
  );

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* weekDates is already sorted Mon -> Sun by the parent component */}
      {weekDates.map((date, index) => {
        // Javascript says Tuesday is 2. Our Map says 2 is Tuesday. It matches!
        const dayEnum = dayMap[date.getDay()];
        const potentialSlots = slotsByDay[dayEnum] ?? [];

        // Filter for specific dates vs recurring
        const daySlots = potentialSlots.filter((slot) => {
          if (slot.isRecurring) return true;
          return isSameDate(date, slot.specificDate);
        });

        // Sort by time
        daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

        return (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-neutral-text mb-1">{dayLabels[dayEnum]}</div>
            <div className="text-xs text-neutral-secondary mb-2">
              {date.getDate()} {date.toLocaleDateString("sv-SE", { month: "short" })}
            </div>

            <div className="space-y-2">
              {daySlots.length === 0 ? (
                <div className="border border-neutral-stroke bg-neutral-bg/50 rounded-lg p-3">
                  <p className="text-xs text-neutral-secondary">Inga pass</p>
                </div>
              ) : (
                daySlots.map((slot) => {
                  const isAvailable =
                    slot.status === TimeSlotStatus.Open && (slot.availableSpots ?? 0) > 0;
                  const isSelected = slot.id === selectedSlotId;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => isAvailable && onSlotClick(slot.id)}
                      disabled={!isAvailable}
                      className={`
                        w-full text-left p-3 rounded-lg border-2 transition-all
                        ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
                        ${
                          isAvailable
                            ? "border-success hover:bg-success/5 cursor-pointer"
                            : "border-error bg-error/5 cursor-not-allowed"
                        }
                      `}
                    >
                      <div className="text-sm font-medium mb-1">{slot.startTime.slice(0, 5)}</div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {slot.subjects.slice(0, 2).map((subject, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 mb-1">
                        {isAvailable ? (
                          <>
                            <CheckCircle size={14} className="text-success" />
                            <span className="text-xs font-medium text-success">Öppet</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} className="text-error" />
                            <span className="text-xs font-medium text-error">Fullt</span>
                          </>
                        )}
                      </div>

                      {isAvailable && (
                        <p className="text-xs text-neutral-secondary">
                          {slot.availableSpots} {slot.availableSpots === 1 ? "plats" : "platser"}
                        </p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
