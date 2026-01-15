import React from "react";
import { BookOpen, Clock } from "lucide-react"; // add MapPin icon later
import { Card, Button, Tag, EmptyState } from "../../common";

export const StudentBookingsList: React.FC = () => {
  const bookings = []; // Empty for now

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Inga bokningar"
        description="Du har inga kommande läxhjälpspass"
        action={{
          label: "Hitta läxhjälp",
          onClick: () => (window.location.href = "/venues"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="mb-6">Mina Bokningar</h2>

      {/* Upcoming Section */}
      <div>
        <h3 className="mb-4">Kommande pass</h3>
        <div className="space-y-4">
          <Card>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Tag variant="success">Bekräftad</Tag>
                </div>
                <h3 className="mb-2">Stadsbiblioteket</h3>
                <div className="flex items-center gap-2 text-neutral-secondary mb-2">
                  <Clock size={16} />
                  <span className="text-sm">Måndag 20 jan 2026, 16:00-18:00</span>
                </div>
                <div className="flex gap-2">
                  <Tag variant="subject">Matematik</Tag>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Avboka
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Previous Bookings */}
      <div>
        <h3 className="mb-4">Tidigare pass</h3>
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Tag variant="default">Genomförd</Tag>
              </div>
              <h3 className="mb-2">Stadsbiblioteket</h3>
              <div className="flex items-center gap-2 text-neutral-secondary">
                <Clock size={16} />
                <span className="text-sm">Måndag 13 jan 2026, 16:00-18:00</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
