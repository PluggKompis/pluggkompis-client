import React, { useState } from "react";
import { StudentBookingsList } from "@/components/features/student/StudentBookingsList";
import { UserProfile } from "@/components/features/shared/UserProfile";

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">("bookings");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Min Elevpanel</h1>

      {/* Tabs */}
      <div className="tabs">
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
        {activeTab === "bookings" && <StudentBookingsList />}
        {activeTab === "profile" && <UserProfile />}
      </div>
    </div>
  );
};
