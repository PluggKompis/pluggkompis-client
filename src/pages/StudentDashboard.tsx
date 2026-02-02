import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { StudentBookingsList } from "@/components/features/student/StudentBookingsList";
import { Button, TabNavigation } from "@/components/common";
import { useAuth } from "@/hooks";

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bookings">("bookings");
  const { user } = useAuth();

  const tabs = [{ id: "bookings", label: "Mina Bokningar" }];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Min Elevpanel</h1>

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

      {/* Responsive Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* Tab Content */}
      <div className="mt-6 md:mt-8">{activeTab === "bookings" && <StudentBookingsList />}</div>
    </div>
  );
};
