import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, Button, Tag, EmptyState } from "../../common";

export const ParentBookingsList: React.FC = () => {
  const bookings = []; // Empty for now

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Inga bokningar"
        description="Du har inga aktiva bokningar för dina barn"
        action={{
          label: "Hitta läxhjälp",
          onClick: () => (window.location.href = "/venues"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-6">Mina Bokningar</h2>

      {/* Example booking card */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3>Anna Andersson</h3>
              <Tag variant="success">Bekräftad</Tag>
            </div>
            <div className="flex items-center gap-2 text-neutral-secondary mb-2">
              <MapPin size={16} />
              <span className="text-sm">Stadsbiblioteket, Göteborg</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-secondary mb-3">
              <Clock size={16} />
              <span className="text-sm">Måndag 20 jan 2026, 16:00-18:00</span>
            </div>
            <div className="flex gap-2">
              <Tag variant="subject">Matematik</Tag>
              <Tag variant="subject">Svenska</Tag>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Avboka
          </Button>
        </div>
      </Card>
    </div>
  );
};
