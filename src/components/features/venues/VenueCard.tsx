import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { Tag } from "../../common";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    location: string;
    city: string;
    availableSpots: number;
    subjects: string[];
    openDays: string;
  };
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const navigate = useNavigate();

  return (
    <div className="venue-card" onClick={() => navigate(`/venues/${venue.id}`)}>
      <h3 className="venue-card-title">{venue.name}</h3>
      <div className="flex items-center gap-2 text-sm text-neutral-secondary mb-3">
        <MapPin size={16} />
        <span>
          {venue.location}, {venue.city}
        </span>
      </div>

      <div className="flex items-center gap-2 my-3">
        <span className="text-sm font-semibold">{venue.availableSpots} lediga platser</span>
        <span className="text-neutral-secondary text-sm">•</span>
        <div className="flex items-center gap-1 text-sm text-neutral-secondary">
          <Clock size={14} />
          <span>{venue.openDays}</span>
        </div>
      </div>

      <div className="venue-card-subjects">
        {venue.subjects.map((subject, index) => (
          <Tag key={index} variant="subject">
            {subject}
          </Tag>
        ))}
      </div>
    </div>
  );
};
