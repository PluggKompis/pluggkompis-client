import React from "react";
import { Card, Button, Tag } from "../../common";

export const VolunteerApplicationCard: React.FC = () => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-neutral-bg rounded-full flex items-center justify-center text-neutral-secondary font-bold">
            MK
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3>Maria Karlsson</h3>
              <Tag variant="warning">Väntande</Tag>
            </div>
            <p className="text-sm text-neutral-secondary mb-2">
              maria.karlsson@email.se • 070-555 44 33
            </p>
            <div className="flex gap-2 mb-3">
              <Tag variant="subject" icon="🧪">
                Kemi
              </Tag>
              <Tag variant="subject" icon="🧬">
                Biologi
              </Tag>
            </div>
            <div className="bg-neutral-bg p-3 rounded-lg">
              <p className="text-sm font-semibold mb-1">Meddelande:</p>
              <p className="text-sm text-neutral-secondary">
                Jag är lärarstudent i sista året och skulle gärna vilja hjälpa till med läxhjälp i
                naturvetenskap. Jag har erfarenhet av att undervisa i gymnasiet.
              </p>
            </div>
            <p className="text-xs text-neutral-secondary mt-2">Ansökte för 2 dagar sedan</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="primary" size="sm">
            ✓ Godkänn
          </Button>
          <Button variant="outline" size="sm">
            ✕ Avslå
          </Button>
        </div>
      </div>
    </Card>
  );
};
