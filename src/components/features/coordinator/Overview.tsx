import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Card, Spinner } from "../../common";
import { DashboardStats } from "./DashboardStats";
import { SubjectCoverageChart } from "./SubjectCoverageChart";
import { TodaysSessions } from "./TodaysSessions";
import { coordinatorService } from "../../../services/coordinatorService";
import type { CoordinatorDashboard } from "@/types";

export const Overview: React.FC = () => {
  const [dashboard, setDashboard] = useState<CoordinatorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const result = await coordinatorService.getDashboard();

        if (result.isSuccess && result.data) {
          setDashboard(result.data);
        } else {
          setError(result.errors?.[0] || "Kunde inte hämta översiktsdata");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setError("Kunde inte hämta översiktsdata");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar översikt...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-error">{error || "Kunde inte ladda översiktsdata"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="mb-6">Översikt</h2>

      {/* Stats Grid */}
      <DashboardStats
        totalVolunteers={dashboard.totalVolunteers}
        totalBookings={dashboard.totalBookingsThisWeek}
        upcomingSessionsCount={dashboard.upcomingShifts.length}
        unfilledShiftsCount={dashboard.unfilledShiftsCount}
      />

      {/* Subject Coverage Chart */}
      <SubjectCoverageChart data={dashboard.subjectCoverage} />

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <TodaysSessions shifts={dashboard.upcomingShifts} />

        {/* Alerts */}
        <Card>
          <h3 className="mb-4">Uppmärksamhet krävs</h3>
          <div className="space-y-4">
            {dashboard.unfilledShiftsCount > 0 && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#E8A93F15" }}
                >
                  <AlertCircle size={24} style={{ color: "#E8A93F" }} />
                </div>
                <div>
                  <p className="font-medium">Ofyllda pass</p>
                  <p className="text-sm text-neutral-secondary">
                    {dashboard.unfilledShiftsCount} pass saknar volontärer de kommande 7 dagarna
                  </p>
                </div>
              </div>
            )}

            {dashboard.unfilledShiftsCount === 0 && (
              <div className="text-center py-4">
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#24A54F15" }}
                >
                  <AlertCircle size={24} style={{ color: "#24A54F" }} />
                </div>
                <p className="text-neutral-secondary">Allt ser bra ut! Inga varningar just nu.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
