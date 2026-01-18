import React from "react";
import { Mail, Phone } from "lucide-react";
import { Card, Tag } from "../../common";
import { VenueDetail as VenueDetailType } from "@/types";

interface VenueDetailProps {
  venue: VenueDetailType;
}

export const VenueDetail: React.FC<VenueDetailProps> = ({ venue }) => {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4">Om platsen</h3>
        <p className="text-neutral-secondary">{venue.description}</p>
      </Card>

      <Card>
        <h3 className="mb-4">Tillgängliga ämnen</h3>
        <div className="flex flex-wrap gap-2">
          {venue.timeSlots
            .flatMap((slot) => slot.subjects)
            .filter((subject, index, self) => self.indexOf(subject) === index)
            .map((subject, index) => (
              <Tag key={index} variant="subject">
                {subject}
              </Tag>
            ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4">Kontakt</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} className="text-neutral-secondary" />
            <span>{venue.contactEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-neutral-secondary" />
            <span>{venue.contactPhone}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
