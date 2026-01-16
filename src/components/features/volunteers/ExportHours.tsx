import React, { useState } from "react";
import { Download } from "lucide-react";
import { Card, Button } from "../../common";

export const ExportHours: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="max-w-2xl">
      <h2 className="mb-6">Exportera Timmar</h2>

      <Card>
        <p className="text-neutral-secondary mb-6">
          Ladda ner en rapport över dina volontärtimmar för en specifik period.
        </p>

        <div className="space-y-4">
          <div>
            <label className="input-label">Från datum</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Till datum</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>

          <Button variant="primary" size="md" className="flex items-center gap-2">
            <Download size={20} />
            Ladda ner rapport
          </Button>
        </div>

        {/* Summary */}
        <div className="mt-8 pt-8 border-t border-neutral-stroke">
          <h3 className="mb-4">Sammanfattning denna månad</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-secondary">Antal pass</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div>
              <p className="text-sm text-neutral-secondary">Totala timmar</p>
              <p className="text-2xl font-bold">16h</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
