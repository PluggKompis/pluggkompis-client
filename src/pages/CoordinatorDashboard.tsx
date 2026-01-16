import React, { useState } from "react";
import { Overview } from "@/components/features/coordinator/Overview";
import { TimeSlotsManager } from "../components/features/coordinator/TimeSlotsManager";
import { VolunteersManager } from "../components/features/coordinator/VolunteersManager";
import { AttendanceTracker } from "@/components/features/coordinator/AttendanceTracker";
import { VenueInfo } from "../components/features/coordinator/VenueInfo";
import { UserProfile } from "@/components/features/shared/UserProfile";

export const CoordinatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeslots" | "volunteers" | "attendance" | "venue" | "user"
  >("overview");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Koordinatorpanel</h1>

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
        <button
          onClick={() => setActiveTab("user")}
          className={`tab ${activeTab === "user" ? "tab-active" : ""}`}
        >
          Mina Uppgifter
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "overview" && <Overview />}
        {activeTab === "timeslots" && <TimeSlotsManager />}
        {activeTab === "volunteers" && <VolunteersManager />}
        {activeTab === "attendance" && <AttendanceTracker />}
        {activeTab === "venue" && <VenueInfo />}
        {activeTab === "user" && <UserProfile />}
      </div>
    </div>
  );
};
