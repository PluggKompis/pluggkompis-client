import React from "react";
import { AlertCircle } from "lucide-react";
import { Card } from "../../common";
import { DashboardStats } from "./DashboardStats";

export const Overview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="mb-6">Översikt</h2>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <h3 className="mb-4">Kommande pass idag</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-neutral-stroke">
              <div>
                <p className="font-semibold">16:00 - 18:00</p>
                <p className="text-sm text-neutral-secondary">3 volontärer, 12 elever</p>
              </div>
              <span className="text-success font-semibold">Aktiv</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-semibold">18:00 - 20:00</p>
                <p className="text-sm text-neutral-secondary">2 volontärer, 8 elever</p>
              </div>
              <span className="text-neutral-secondary">Kommande</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="mb-4">Senaste aktivitet</h3>
          <div className="space-y-3">
            <div className="py-2 border-b border-neutral-stroke">
              <p className="text-sm">
                <span className="font-semibold">Anna Svensson</span> bokade ett pass
              </p>
              <p className="text-xs text-neutral-secondary">För 2 timmar sedan</p>
            </div>
            <div className="py-2 border-b border-neutral-stroke">
              <p className="text-sm">
                <span className="font-semibold">Erik Andersson</span> anmälde sig som volontär
              </p>
              <p className="text-xs text-neutral-secondary">För 5 timmar sedan</p>
            </div>
            <div className="py-2">
              <p className="text-sm">
                <span className="font-semibold">Maria Johansson</span> avbokade ett pass
              </p>
              <p className="text-xs text-neutral-secondary">Igår</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts/Notices */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} className="text-warning" />
          </div>
          <div>
            <h3 className="mb-2">Uppmärksamhet krävs</h3>
            <p className="text-neutral-secondary">
              Du har 2 volontäransökningar som väntar på godkännande.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
