import React from "react";
import { TimeSlotCard } from "./TimeSlotCard";

interface WeekViewProps {
  selectedDate: Date;
}

export const WeekView: React.FC<WeekViewProps> = (
  {
    /* selectedDate, */
  }
) => {
  const days = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
  const dates = [20, 21, 22, 23, 24, 25, 26]; // Mock dates

  return (
    <div>
      <div className="schedule-week">
        {days.map((day, index) => (
          <div key={index} className="schedule-day">
            <div className="schedule-day-header">
              <div className="font-bold">{day}</div>
              <div className="schedule-day-date">{dates[index]} jan</div>
            </div>

            {/* Timeslots for this day */}
            {index < 5 && ( // Only show slots on weekdays for demo
              <div className="space-y-3 mt-3">
                <TimeSlotCard
                  time="16:00"
                  subjects={["Matematik", "Svenska"]}
                  availableSpots={8}
                  status="open"
                />
                {index === 2 && ( // Extra slot on Wednesday
                  <TimeSlotCard
                    time="18:00"
                    subjects={["Fysik", "Kemi"]}
                    availableSpots={0}
                    status="full"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
