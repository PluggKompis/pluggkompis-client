import React, { useState } from "react"; // add useEffect here
import { Mail, Phone } from "lucide-react";
import { Card, Button, Tag, Input } from "../../common";
import { VolunteerApplicationCard } from "./VolunteerApplicationCard";
import { VolunteerApplication, VolunteerApplicationStatus } from "@/types"; // add VolunteerWithVenue here

export const VolunteersManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "all">("active");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for now (replace with API call later)
  const mockApplications: VolunteerApplication[] = [
    {
      id: "1",
      volunteerId: "v1",
      venueId: "venue1",
      status: VolunteerApplicationStatus.Pending,
      appliedAt: new Date().toISOString(),
      volunteerName: "Maria Karlsson",
      volunteerEmail: "maria.karlsson@email.se",
      message:
        "Jag är lärarstudent i sista året och skulle gärna vilja hjälpa till med läxhjälp i naturvetenskap.",
    },
  ];

  const handleApprove = async (applicationId: string) => {
    // TODO: Call API to approve
    console.log("Approve application:", applicationId);
  };

  const handleDecline = async (applicationId: string) => {
    // TODO: Call API to decline
    console.log("Decline application:", applicationId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>Volontärer</h2>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Sök volontär..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "active" ? "bg-primary text-white" : "bg-neutral-bg"
              }`}
            >
              Aktiva (12)
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "pending" ? "bg-primary text-white" : "bg-neutral-bg"
              }`}
            >
              Väntande ({mockApplications.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "all" ? "bg-primary text-white" : "bg-neutral-bg"
              }`}
            >
              Alla
            </button>
          </div>
        </div>
      </Card>

      {/* Volunteers List */}
      <div className="space-y-4">
        {activeTab === "pending" ? (
          <>
            {mockApplications.length > 0 ? (
              mockApplications.map((app) => (
                <VolunteerApplicationCard
                  key={app.id}
                  application={app}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              ))
            ) : (
              <Card>
                <p className="text-center text-neutral-secondary py-4">Inga väntande ansökningar</p>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Active/All Volunteers */}
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3>Anna Svensson</h3>
                      <Tag variant="success">Aktiv</Tag>
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-secondary">
                        <Mail size={14} />
                        <span>anna.svensson@email.se</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-secondary">
                        <Phone size={14} />
                        <span>070-123 45 67</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Tag variant="subject">Matematik</Tag>
                      <Tag variant="subject">Fysik</Tag>
                    </div>
                    <p className="text-sm text-neutral-secondary">
                      Genomförda pass: 24 • Totala timmar: 48h
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Se profil
                  </Button>
                  <Button variant="outline" size="sm">
                    Schemalägg
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
