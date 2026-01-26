import React, { useState } from "react";
import { Card, Button } from "../../common";
import { Subject, WeekDay, WeekDayLabels } from "@/types";
import { X } from "lucide-react";

interface VenueFiltersProps {
  subjects: Subject[];
  availableCities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedSubjectIds: string[];
  onSubjectIdsChange: (subjectIds: string[]) => void;
  selectedDays: WeekDay[];
  onDaysChange: (days: WeekDay[]) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const VenueFilters: React.FC<VenueFiltersProps> = ({
  subjects,
  availableCities,
  selectedCity,
  onCityChange,
  selectedSubjectIds,
  onSubjectIdsChange,
  selectedDays,
  onDaysChange,
  isOpen = true,
  onClose,
}) => {
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  // Define day order starting with Monday
  const dayOrder: WeekDay[] = [
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
    WeekDay.Friday,
    WeekDay.Saturday,
    WeekDay.Sunday,
  ];

  const handleReset = () => {
    onCityChange("");
    onSubjectIdsChange([]);
    onDaysChange([]);
  };

  const handleSubjectToggle = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      onSubjectIdsChange(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      onSubjectIdsChange([...selectedSubjectIds, subjectId]);
    }
  };

  const handleDayToggle = (day: WeekDay) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  // Count active filters
  const activeFilterCount =
    (selectedCity ? 1 : 0) + selectedSubjectIds.length + selectedDays.length;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Filter Panel */}
      <div
        className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-auto
        transition-transform duration-300 ease-in-out
        lg:transition-none
      `}
      >
        <Card className="h-full lg:h-auto overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="text-lg font-semibold">Filter</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-bg rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <h3>Filter</h3>
            {activeFilterCount > 0 && (
              <span className="text-sm text-primary font-medium">{activeFilterCount} aktiva</span>
            )}
          </div>

          <div className="space-y-4">
            {/* City Filter - Single Select */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-1">Stad</label>
              <select
                className="w-full px-3 py-2 border border-neutral-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
              >
                <option value="">Alla städer</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter - Multi-Select Dropdown with Checkboxes */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-text mb-1">Ämnen</label>
              <button
                type="button"
                className="w-full px-3 py-2 border border-neutral-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left flex items-center justify-between bg-white hover:bg-neutral-bg"
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              >
                <span className="text-sm text-neutral-text">
                  {selectedSubjectIds.length === 0
                    ? "Alla ämnen"
                    : `${selectedSubjectIds.length} ämne${selectedSubjectIds.length > 1 ? "n" : ""} valda`}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isSubjectDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isSubjectDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSubjectDropdownOpen(false)}
                  />

                  {/* Dropdown Content */}
                  <div className="absolute z-20 w-full mt-1 bg-white border border-neutral-stroke rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {subjects.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-neutral-secondary">
                        Inga ämnen tillgängliga
                      </div>
                    ) : (
                      subjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-bg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubjectIds.includes(subject.id)}
                            onChange={() => handleSubjectToggle(subject.id)}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="text-sm">
                            {subject.icon} {subject.name}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Day Filter - Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">Dagar</label>
              <div className="space-y-2">
                {dayOrder.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 cursor-pointer hover:bg-neutral-bg rounded px-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm">{WeekDayLabels[day]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleReset}
              disabled={activeFilterCount === 0}
            >
              Rensa filter
            </Button>

            {/* Mobile Apply Button */}
            {onClose && (
              <Button variant="primary" size="md" className="w-full lg:hidden" onClick={onClose}>
                Visa resultat
              </Button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};
