import React from "react";
import { Search, MapPin, Clock } from "lucide-react";
import { Card, Tag, Button, EmptyState } from "../../common";

export const AvailableShifts: React.FC = () => {
  const shifts = []; // Empty for now

  if (shifts.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="Inga lediga pass"
        description="Det finns inga lediga pass just nu"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-6">Tillgängliga Pass</h2>

      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2">Stadsbiblioteket</h3>
            <div className="flex items-center gap-2 text-neutral-secondary mb-2">
              <Clock size={16} />
              <span className="text-sm">Tisdag 21 jan 2026, 17:00-19:00</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-secondary mb-2">
              <MapPin size={16} />
              <span className="text-sm">Göteborg</span>
            </div>
            <div className="flex gap-2">
              <Tag variant="subject">Kemi</Tag>
              <Tag variant="subject">Fysik</Tag>
            </div>
          </div>
          <Button variant="primary" size="sm">
            Boka pass
          </Button>
        </div>
      </Card>
    </div>
  );
};
