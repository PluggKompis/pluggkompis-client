import React from "react";
import { Card, Button } from "../../common";
import { Subject, WeekDay, WeekDayLabels } from "@/types";

interface VenueFiltersProps {
  subjects: Subject[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedSubjectId: string;
  onSubjectChange: (subjectId: string) => void;
  selectedDay: WeekDay | "";
  onDayChange: (day: WeekDay | "") => void;
}

export const VenueFilters: React.FC<VenueFiltersProps> = ({
  subjects,
  selectedCity,
  onCityChange,
  selectedSubjectId,
  onSubjectChange,
  selectedDay,
  onDayChange,
}) => {
  const handleReset = () => {
    onCityChange("");
    onSubjectChange("");
    onDayChange("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="mb-4">Filter</h3>

        <div className="space-y-4">
          {/* City Filter */}
          <div>
            <label className="filter-label">Stad</label>
            <select
              className="filter-select"
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
            >
              <option value="">Alla städer</option>
              <option value="Göteborg">Göteborg</option>
              <option value="Stockholm">Stockholm</option>
              <option value="Malmö">Malmö</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="filter-label">Ämne</label>
            <select
              className="filter-select"
              value={selectedSubjectId}
              onChange={(e) => onSubjectChange(e.target.value)}
            >
              <option value="">Alla ämnen</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div>
            <label className="filter-label">Dag</label>
            <select
              className="filter-select"
              value={selectedDay}
              onChange={(e) => onDayChange(e.target.value as WeekDay | "")}
            >
              <option value="">Alla dagar</option>
              {Object.entries(WeekDayLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <Button variant="outline" size="sm" className="w-full" onClick={handleReset}>
            Rensa filter
          </Button>
        </div>
      </Card>
    </div>
  );
};
