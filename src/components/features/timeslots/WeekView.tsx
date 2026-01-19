import React from "react";
import { TimeSlotSummary, TimeSlotStatus, WeekDay } from "@/types";
import { CheckCircle, AlertCircle } from "lucide-react";

interface WeekViewProps {
  timeSlots: TimeSlotSummary[];
  weekDates: Date[];
  onSlotClick: (slotId: string) => void;
  selectedSlotId: string | null;
}

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
  const isSameDate = (dateObj: Date, dateString?: string) => {
    if (!dateString) return false;
    const d2 = new Date(dateString);
    return (
      dateObj.getFullYear() === d2.getFullYear() &&
      dateObj.getMonth() === d2.getMonth() &&
      dateObj.getDate() === d2.getDate()
    );
  };

  const slotsByDay = timeSlots.reduce(
    (acc, slot) => {
      let key = slot.dayOfWeek as WeekDay;

      if (!slot.isRecurring && slot.specificDate) {
        const d = new Date(slot.specificDate);
        key = dayMap[d.getDay()];
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    },
    {} as Record<WeekDay, TimeSlotSummary[]>
  );

  const renderDayColumn = (date: Date, index: number) => {
    const dayEnum = dayMap[date.getDay()];
    const potentialSlots = slotsByDay[dayEnum] ?? [];

    const daySlots = potentialSlots.filter((slot) => {
      if (slot.isRecurring) return true;
      return isSameDate(date, slot.specificDate);
    });

    daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div key={index} className="text-center">
        {/* Day Header */}
        <div className="mb-3">
          <div className="text-sm font-semibold text-neutral-text">{dayLabels[dayEnum]}</div>
          <div className="text-xs text-neutral-secondary">
            {date.getDate()} {date.toLocaleDateString("sv-SE", { month: "short" })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          {daySlots.length === 0 ? (
            <div className="border border-neutral-stroke bg-neutral-bg/50 rounded-lg p-4">
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
                    ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
                    ${
                      isAvailable
                        ? "border-success hover:bg-success/5 cursor-pointer"
                        : "border-error bg-error/5 cursor-not-allowed"
                    }
                  `}
                >
                  {/* Time */}
                  <div className="text-sm font-semibold mb-2">{slot.startTime.slice(0, 5)}</div>

                  {/* Subjects - Full Names on Mobile! */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {slot.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1"
                      >
                        {typeof subject === "object" && subject.icon && <span>{subject.icon}</span>}
                        <span>{typeof subject === "string" ? subject : subject.name}</span>
                      </span>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    {isAvailable ? (
                      <>
                        <CheckCircle size={12} className="text-success" />
                        <span className="text-xs font-medium text-success">
                          {slot.availableSpots} {slot.availableSpots === 1 ? "plats" : "platser"}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} className="text-error" />
                        <span className="text-xs font-medium text-error">Fullt</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile: 2-column grid */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {weekDates.map((date, index) => renderDayColumn(date, index))}
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-2">
        {weekDates.map((date, index) => renderDayColumn(date, index))}
      </div>
    </>
  );
};
