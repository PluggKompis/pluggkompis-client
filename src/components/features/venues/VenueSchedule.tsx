import React, { useState } from "react";
import { Card, Button, Tag } from "../../common";
import { WeekView } from "../timeslots/WeekView";

interface VenueScheduleProps {
  venueId: string;
}

export const VenueSchedule: React.FC<VenueScheduleProps> = (
  {
    /* venueId, */
  }
) => {
  const [selectedDate /* setSelectedDate*/] = useState(new Date());

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3>Välj ett pass</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              ← Föregående vecka
            </Button>
            <Button variant="outline" size="sm">
              Nästa vecka →
            </Button>
          </div>
        </div>

        <WeekView selectedDate={selectedDate} />
      </Card>

      {/* Available Slots List */}
      <div className="space-y-4">
        <h3>Lediga pass denna vecka</h3>

        <Card>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3>Måndag 20 januari</h3>
                <Tag variant="success">8 platser kvar</Tag>
              </div>
              <p className="text-neutral-secondary mb-2">🕐 16:00 - 18:00</p>
              <div className="flex gap-2">
                <Tag variant="subject" icon="📐">
                  Matematik
                </Tag>
                <Tag variant="subject" icon="📖">
                  Svenska
                </Tag>
                <Tag variant="subject" icon="🌍">
                  Engelska
                </Tag>
              </div>
            </div>
            <Button variant="primary" size="sm">
              Boka pass
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3>Tisdag 21 januari</h3>
                <Tag variant="warning">3 platser kvar</Tag>
              </div>
              <p className="text-neutral-secondary mb-2">🕐 17:00 - 19:00</p>
              <div className="flex gap-2">
                <Tag variant="subject" icon="⚛️">
                  Fysik
                </Tag>
                <Tag variant="subject" icon="🧪">
                  Kemi
                </Tag>
              </div>
            </div>
            <Button variant="primary" size="sm">
              Boka pass
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3>Onsdag 22 januari</h3>
                <Tag variant="error">Fullbokat</Tag>
              </div>
              <p className="text-neutral-secondary mb-2">🕐 16:00 - 18:00</p>
              <div className="flex gap-2">
                <Tag variant="subject" icon="📐">
                  Matematik
                </Tag>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Fullbokat
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
