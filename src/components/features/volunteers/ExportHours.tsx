import React, { useState } from "react";
import { Download, AlertCircle, Calendar } from "lucide-react";
import { Card, Button, Input } from "../../common";
import { volunteerService } from "@/services";

export const ExportHours: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    // Validation
    if (!startDate || !endDate) {
      setError("Välj både start- och slutdatum");
      return;
    }

    if (startDate > endDate) {
      setError("Startdatum måste vara före slutdatum");
      return;
    }

    try {
      setIsDownloading(true);
      setError(null);
      setSuccess(false);

      // Call API to get PDF blob
      const blob = await volunteerService.exportHoursPdf(startDate, endDate);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `volontar-timmar-${startDate}-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide after 3s
    } catch (err) {
      console.error("Failed to download PDF:", err);
      setError("Kunde inte ladda ner rapporten. Kontrollera att du har pass under denna period.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper: Set default date range (current month)
  const setCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(lastDay.toISOString().split("T")[0]);
    setError(null);
  };

  const setLastMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(lastDay.toISOString().split("T")[0]);
    setError(null);
  };

  const setYearToDate = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(now.toISOString().split("T")[0]);
    setError(null);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="mb-2">Exportera Timmar</h2>
        <p className="text-sm text-neutral-secondary">
          Ladda ner en PDF-rapport över dina volontärtimmar för CSN, universitet, eller andra
          ändamål
        </p>
      </div>

      <Card>
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3">
            <svg
              className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-success text-sm font-medium">PDF har laddats ner!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <p className="text-sm font-semibold mb-3">Snabbval:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={setCurrentMonth}>
                Denna månad
              </Button>
              <Button variant="outline" size="sm" onClick={setLastMonth}>
                Förra månaden
              </Button>
              <Button variant="outline" size="sm" onClick={setYearToDate}>
                Hittills i år
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Från datum"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError(null);
                }}
                max={new Date().toISOString().split("T")[0]} // Can't select future
              />
            </div>
            <div>
              <Input
                label="Till datum"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError(null);
                }}
                max={new Date().toISOString().split("T")[0]} // Can't select future
              />
            </div>
          </div>

          {/* Download Button */}
          <Button
            variant="primary"
            size="md"
            onClick={handleDownload}
            disabled={isDownloading || !startDate || !endDate}
            className="w-full flex items-center justify-center gap-2"
          >
            <Download size={20} />
            {isDownloading ? "Laddar ner..." : "Ladda ner PDF-rapport"}
          </Button>

          {/* Info Section */}
          <div className="space-y-4 pt-6 border-t border-neutral-stroke">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Om rapporten</p>
                  <p className="text-sm text-neutral-secondary">
                    PDF:en innehåller alla dina volontärpass med datum, tid, plats och totala
                    timmar. Rapporten är formaterad för att passa CSN-krav och universitets
                    poängbevis.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-neutral-secondary">
              <p className="font-semibold mb-2">Användningsområden:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>CSN-ansökan för studiemedel</li>
                <li>Universitetspoäng (högskolepoäng)</li>
                <li>CV och jobbansökningar</li>
                <li>Personlig dokumentation</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
