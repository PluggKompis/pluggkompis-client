import React, { useState } from "react";
import { MyShifts } from "@/components/features/volunteers/MyShifts";
import { AvailableShifts } from "@/components/features/volunteers/AvailableShifts";
import { ExportHours } from "@/components/features/volunteers/ExportHours";
import { VolunteerProfile } from "@/components/features/volunteers/VolunteerProfile";
import { UserProfile } from "../components/features/shared/UserProfile";

export const VolunteerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "shifts" | "available" | "export" | "profile" | "user"
  >("shifts");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Volontärpanel</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("shifts")}
          className={`tab ${activeTab === "shifts" ? "tab-active" : ""}`}
        >
          Mina Pass
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`tab ${activeTab === "available" ? "tab-active" : ""}`}
        >
          Tillgängliga Pass
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`tab ${activeTab === "export" ? "tab-active" : ""}`}
        >
          Exportera Timmar
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
        >
          Volontärprofil
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
        {activeTab === "shifts" && <MyShifts />}
        {activeTab === "available" && <AvailableShifts />}
        {activeTab === "export" && <ExportHours />}
        {activeTab === "profile" && <VolunteerProfile />}
        {activeTab === "user" && <UserProfile />}
      </div>
    </div>
  );
};
