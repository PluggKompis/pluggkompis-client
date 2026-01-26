import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users } from "lucide-react";
import { Card, Tag, SubjectTag } from "../../common";
import { Venue } from "@/types";

interface VenueCardProps {
  venue: Venue;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  return (
    <Link to={`/venues/${venue.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex flex-col h-full">
          {/* Venue Header */}
          <div className="mb-4">
            <h3 className="mb-2">{venue.name}</h3>
            <div className="flex items-start gap-2 text-sm text-neutral-secondary">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                {venue.address}, {venue.city}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-secondary mb-4 line-clamp-2">{venue.description}</p>

          {/* Available Days */}
          {venue.availableDays && venue.availableDays.length > 0 && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Clock size={16} className="text-neutral-secondary" />
              <span className="text-neutral-secondary">{venue.availableDays.join(", ")}</span>
            </div>
          )}

          {/* Subjects */}
          {venue.availableSubjects && venue.availableSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {venue.availableSubjects.slice(0, 3).map((subject) => (
                <SubjectTag key={subject.id} name={subject.name} icon={subject.icon} />
              ))}
              {venue.availableSubjects.length > 3 && (
                <Tag variant="default">+{venue.availableSubjects.length - 3}</Tag>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-neutral-stroke flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-secondary">
              <Users size={16} />
              <span>Koordinator: {venue.coordinatorName}</span>
            </div>
            {venue.isActive && (
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Öppet</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
