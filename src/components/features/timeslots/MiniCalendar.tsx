import React from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const daysInMonth = 31; // Simplified
  const firstDayOfWeek = 3; // Starts on Wednesday (0 = Monday)
  const days = ["M", "T", "O", "T", "F", "L", "S"];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button className="text-neutral-secondary hover:text-black">←</button>
        <span className="font-semibold">Januari 2026</span>
        <button className="text-neutral-secondary hover:text-black">→</button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center text-xs text-neutral-secondary">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelected = day === selectedDate.getDate();
          const hasEvents = day === 20 || day === 21 || day === 22; // Mock

          return (
            <button
              key={day}
              onClick={() => onDateSelect(new Date(2026, 0, day))}
              className={`
                aspect-square rounded-lg text-sm font-semibold
                transition-colors duration-200
                ${isSelected ? "bg-primary text-white" : "hover:bg-neutral-bg"}
                ${hasEvents && !isSelected ? "bg-primary-light/20" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-neutral-secondary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-light/20 rounded" />
          <span>Pass tillgängliga</span>
        </div>
      </div>
    </div>
  );
};
