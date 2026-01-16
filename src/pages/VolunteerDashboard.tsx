import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { MyShifts } from "@/components/features/volunteers/MyShifts";
import { AvailableShifts } from "@/components/features/volunteers/AvailableShifts";
import { ExportHours } from "@/components/features/volunteers/ExportHours";
import { VolunteerProfile } from "@/components/features/volunteers/VolunteerProfile";
import { Button } from "@/components/common";
import { useAuth } from "@/hooks";

export const VolunteerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"shifts" | "available" | "export" | "profile">(
    "shifts"
  );
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Volontärpanel</h1>

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
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "shifts" && <MyShifts />}
        {activeTab === "available" && <AvailableShifts />}
        {activeTab === "export" && <ExportHours />}
        {activeTab === "profile" && <VolunteerProfile />}
      </div>
    </div>
  );
};
