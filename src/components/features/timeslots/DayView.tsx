import React from "react";
import { Card, Tag, Button } from "../../common";

interface DayViewProps {
  selectedDate: Date;
}

export const DayView: React.FC<DayViewProps> = ({ selectedDate }) => {
  // Use selectedDate when we implement the logic
  console.log("Selected date:", selectedDate);
  return (
    <Card>
      <h3 className="mb-4">Måndag 20 januari 2026</h3>

      <div className="space-y-4">
        <div className="p-4 border border-neutral-stroke rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold mb-1">16:00 - 18:00</h4>
              <div className="flex items-center gap-2 mb-2">
                <Tag variant="success">8 platser kvar</Tag>
              </div>
              <div className="flex gap-2">
                <Tag variant="subject" icon="📐">
                  Matematik
                </Tag>
                <Tag variant="subject" icon="📖">
                  Svenska
                </Tag>
              </div>
            </div>
            <Button variant="primary" size="sm">
              Boka
            </Button>
          </div>

          <div className="pt-3 border-t border-neutral-stroke">
            <p className="text-sm font-semibold mb-2">Volontärer (2):</p>
            <div className="flex gap-2">
              <span className="text-sm text-neutral-secondary">Anna S.</span>
              <span className="text-sm text-neutral-secondary">Erik J.</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-neutral-stroke rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold mb-1">18:00 - 20:00</h4>
              <div className="flex items-center gap-2 mb-2">
                <Tag variant="warning">2 platser kvar</Tag>
              </div>
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
              Boka
            </Button>
          </div>

          <div className="pt-3 border-t border-neutral-stroke">
            <p className="text-sm font-semibold mb-2">Volontärer (1):</p>
            <div className="flex gap-2">
              <span className="text-sm text-neutral-secondary">Maria K.</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
