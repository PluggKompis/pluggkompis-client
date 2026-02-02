import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, AlertCircle } from "lucide-react";
import { ChildrenList } from "@/components/features/parent/ChildrenList";
import { ParentBookingsList } from "@/components/features/parent/ParentBookingsList";
import { Button, TabNavigation } from "@/components/common";
import { useAuth } from "@/hooks";

export const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"children" | "bookings">("children");
  const { user } = useAuth();
  const tabs = [
    { id: "children", label: "Mina Barn" },
    { id: "bookings", label: "Bokningar" },
  ];
  const location = useLocation();

  const message = (location.state as { message?: string })?.message; // Get message from navigation state

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Min Föräldrapanel</h1>

      {/* Show warning message if redirected from booking */}
      {message && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <p className="text-warning font-medium">{message}</p>
        </div>
      )}

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
      <div className="mt-6 md:mt-8">
        {activeTab === "children" && <ChildrenList />}
        {activeTab === "bookings" && <ParentBookingsList />}
      </div>
    </div>
  );
};
