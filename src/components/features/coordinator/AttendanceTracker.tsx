import React, { useState } from "react";
import { Card, Button, Tag } from "../../common";

export const AttendanceTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Närvaro</h2>
      </div>

      {/* Date Selector */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="input-label">Välj datum</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <Button variant="primary" size="sm">
            Visa närvaro
          </Button>
        </div>
      </Card>

      {/* Session List */}
      <div className="space-y-4">
        <Card>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3>16:00 - 18:00</h3>
              <Tag variant="success">Pågående</Tag>
            </div>
            <p className="text-sm text-neutral-secondary">2 volontärer • 8 elever bokade</p>
          </div>

          {/* Volunteers */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-sm">Volontärer</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-neutral-bg rounded">
                <span className="text-sm">Anna Svensson</span>
                <Tag variant="success">✓ Närvarande</Tag>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-bg rounded">
                <span className="text-sm">Erik Johansson</span>
                <Tag variant="success">✓ Närvarande</Tag>
              </div>
            </div>
          </div>

          {/* Students */}
          <div>
            <h4 className="font-semibold mb-2 text-sm">Elever (8 bokade)</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-neutral-bg rounded">
                <span className="text-sm">Emma Andersson</span>
                <Tag variant="success">✓ Närvarande</Tag>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-bg rounded">
                <span className="text-sm">Oscar Berg</span>
                <Tag variant="success">✓ Närvarande</Tag>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-bg rounded">
                <span className="text-sm">Lina Karlsson</span>
                <Tag variant="error">✕ Frånvarande</Tag>
              </div>
              <div className="flex items-center justify-between p-2 bg-neutral-bg rounded">
                <span className="text-sm">Noah Svensson</span>
                <Tag variant="default">Ej incheckad</Tag>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
