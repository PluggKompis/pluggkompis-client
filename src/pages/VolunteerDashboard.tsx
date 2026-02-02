import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { MyShifts } from "@/components/features/volunteers/MyShifts";
import { AvailableShifts } from "@/components/features/volunteers/AvailableShifts";
import { ExportHours } from "@/components/features/volunteers/ExportHours";
import { VolunteerProfile } from "@/components/features/volunteers/VolunteerProfile";
import { MyApplications } from "@/components/features/volunteers/MyApplications";
import { Button, TabNavigation } from "@/components/common";
import { useAuth } from "@/hooks";

export const VolunteerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "applications" | "shifts" | "available" | "export"
  >("profile");
  const { user } = useAuth();

  const tabs = [
    { id: "profile", label: "Volontärprofil" },
    { id: "applications", label: "Ansökningar" },
    { id: "shifts", label: "Mina Pass" },
    { id: "available", label: "Tillgängliga Pass" },
    { id: "export", label: "Exportera" },
  ];

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
            Kontoinställningar
          </Button>
        </Link>
      </div>

      {/* Responsive Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* Tab Content */}
      <div className="mt-6 md:mt-8">
        {activeTab === "profile" && <VolunteerProfile />}
        {activeTab === "applications" && <MyApplications />}
        {activeTab === "shifts" && <MyShifts />}
        {activeTab === "available" && <AvailableShifts />}
        {activeTab === "export" && <ExportHours />}
      </div>
    </div>
  );
};
