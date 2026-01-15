import React from "react";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Card, Tag, Button, EmptyState } from "../../common";

export const MyShifts: React.FC = () => {
  const shifts = []; // Empty for now

  if (shifts.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Inga pass bokade"
        description="Du har inga kommande volontärpass"
        action={{
          label: "Se tillgängliga pass",
          onClick: () => console.log("Go to available shifts"),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-6">Mina Pass</h2>

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
            <div className="flex items-center gap-2 text-neutral-secondary mb-2">
              <Users size={16} />
              <span className="text-sm">5 elever inbokade</span>
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
