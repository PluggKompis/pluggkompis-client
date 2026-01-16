import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { Tag } from "../../common";
import { Venue, WeekDayLabels } from "@/types/venue.types";

interface VenueCardProps {
  venue: Venue;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const navigate = useNavigate();

  // Get unique opening days from openingHours
  const openDays = venue.openingHours
    .map((oh) => WeekDayLabels[oh.dayOfWeek])
    .slice(0, 3) // Show first 3 days to keep it compact
    .join(", ");

  // Get subject names
  const subjectNames = venue.subjects.map((subject) => subject.name);

  return (
    <div className="venue-card" onClick={() => navigate(`/venues/${venue.id}`)}>
      <h3 className="venue-card-title">{venue.name}</h3>

      <div className="flex items-center gap-2 text-sm text-neutral-secondary mb-3">
        <MapPin size={16} />
        <span>
          {venue.address}, {venue.postalCode} {venue.city}
        </span>
      </div>

      <div className="flex items-center gap-2 my-3">
        <span className="text-sm font-semibold">{venue.maxStudentsPerSession} lediga platser</span>
        <span className="text-neutral-secondary text-sm">•</span>
        <div className="flex items-center gap-1 text-sm text-neutral-secondary">
          <Clock size={14} />
          <span>{openDays || "Kontakta"}</span>
        </div>
      </div>

      <div className="venue-card-subjects">
        {subjectNames.map((subjectName) => (
          <Tag key={subjectName} variant="subject">
            {subjectName}
          </Tag>
        ))}
      </div>
    </div>
  );
};
