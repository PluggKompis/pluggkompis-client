import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Overview } from "@/components/features/coordinator/Overview";
import { TimeSlotsManager } from "@/components/features/coordinator/TimeSlotsManager";
import { VolunteersManager } from "@/components/features/coordinator/VolunteersManager";
import { AttendanceTracker } from "@/components/features/coordinator/AttendanceTracker";
import { VenueInfo } from "@/components/features/coordinator/VenueInfo";
import { Button } from "@/components/common";
import { useAuth } from "@/hooks";

export const CoordinatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeslots" | "volunteers" | "attendance" | "venue"
  >("overview");
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Koordinatorpanel</h1>

      {/* Profile Quick Access */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User size={20} className="text-primary" />
          <div>
            <p className="font-semibold text-sm">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-neutral-secondary">{user?.email}</p>
          </div>
        </div>
        <Link to="/profile">
          <Button variant="outline" size="sm">
            Redigera profil
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
        >
          Översikt
        </button>
        <button
          onClick={() => setActiveTab("timeslots")}
          className={`tab ${activeTab === "timeslots" ? "tab-active" : ""}`}
        >
          Tider
        </button>
        <button
          onClick={() => setActiveTab("volunteers")}
          className={`tab ${activeTab === "volunteers" ? "tab-active" : ""}`}
        >
          Volontärer
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`tab ${activeTab === "attendance" ? "tab-active" : ""}`}
        >
          Närvaro
        </button>
        <button
          onClick={() => setActiveTab("venue")}
          className={`tab ${activeTab === "venue" ? "tab-active" : ""}`}
        >
          Min Plats
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "overview" && <Overview />}
        {activeTab === "timeslots" && <TimeSlotsManager />}
        {activeTab === "volunteers" && <VolunteersManager />}
        {activeTab === "attendance" && <AttendanceTracker />}
        {activeTab === "venue" && <VenueInfo />}
      </div>
    </div>
  );
};
