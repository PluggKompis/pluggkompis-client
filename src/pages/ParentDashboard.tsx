import React, { useState } from "react";
import { ChildrenList } from "@/components/features/parent/ChildrenList";
import { ParentBookingsList } from "@/components/features/parent/ParentBookingsList";
import { UserProfile } from "@/components/features/shared/UserProfile";

export const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"children" | "bookings" | "profile">("children");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Min Föräldrapanel</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("children")}
          className={`tab ${activeTab === "children" ? "tab-active" : ""}`}
        >
          Mina Barn
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`tab ${activeTab === "bookings" ? "tab-active" : ""}`}
        >
          Mina Bokningar
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
        >
          Min Profil
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "children" && <ChildrenList />}
        {activeTab === "bookings" && <ParentBookingsList />}
        {activeTab === "profile" && <UserProfile />}
      </div>
    </div>
  );
};
