import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Card, Button, Input, Spinner } from "../../common";
import { VolunteerApplicationCard } from "./VolunteerApplicationCard";
import { ActiveVolunteerCard } from "@/components/features/coordinator/ActiveVolunteerCard";
import { coordinatorService, venueService } from "@/services";
import { CoordinatorVolunteerApplication, VolunteerProfileDto } from "@/types";

export const VolunteersManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "all">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [pendingApplications, setPendingApplications] = useState<CoordinatorVolunteerApplication[]>(
    []
  );
  const [activeVolunteers, setActiveVolunteers] = useState<VolunteerProfileDto[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch coordinator's venue first (just to get the ID)
      const venueResult = await venueService.getMyVenue();
      console.log("🔍 Venue result:", venueResult);

      if (!venueResult.isSuccess || !venueResult.data) {
        setError("Kunde inte hitta din plats. Se till att du har skapat en plats först.");
        setLoading(false);
        return;
      }

      const venueId = venueResult.data.id;

      // Now fetch the volunteers using dedicated endpoint
      const volunteersResult = await venueService.getVenueVolunteers(venueId);
      if (volunteersResult.isSuccess && volunteersResult.data) {
        console.log("🔍 Volunteers:", volunteersResult.data);
        setActiveVolunteers(volunteersResult.data);
      }

      // Fetch pending applications
      const appsResult = await coordinatorService.getPendingApplications();
      if (appsResult.isSuccess && appsResult.data) {
        setPendingApplications(appsResult.data);
      }
    } catch (err) {
      console.error("Failed to fetch volunteer data:", err);
      setError("Ett oväntat fel uppstod. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      const result = await coordinatorService.approveApplication(applicationId, {
        decisionNote: undefined,
      });

      if (result.isSuccess) {
        // Refresh data to show updated lists
        await fetchData();
      } else {
        alert(result.errors?.[0] || "Kunde inte godkänna ansökan");
      }
    } catch (err) {
      console.error("Failed to approve application:", err);
      alert("Ett oväntat fel uppstod");
    }
  };

  const handleDecline = async (applicationId: string, reason?: string) => {
    try {
      const result = await coordinatorService.declineApplication(applicationId, {
        decisionNote: reason,
      });

      if (result.isSuccess) {
        // Refresh data to show updated lists
        await fetchData();
      } else {
        alert(result.errors?.[0] || "Kunde inte avslå ansökan");
      }
    } catch (err) {
      console.error("Failed to decline application:", err);
      alert("Ett oväntat fel uppstod");
    }
  };

  // Filter volunteers by search query
  const filteredVolunteers = activeVolunteers.filter((v) =>
    v.volunteerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar volontärer...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-error flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1 text-error">Kunde inte ladda volontärer</h3>
            <p className="text-sm text-neutral-secondary mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline" size="sm">
              Försök igen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    "Pending application IDs:",
    pendingApplications.map((a) => a.applicationId)
  );
  console.log(
    "Active volunteer IDs:",
    filteredVolunteers.map((v) => v.volunteerId)
  );

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
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === "active"
                  ? "bg-primary text-white"
                  : "bg-neutral-bg hover:bg-neutral-stroke"
              }`}
            >
              Aktiva ({activeVolunteers.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === "pending"
                  ? "bg-primary text-white"
                  : "bg-neutral-bg hover:bg-neutral-stroke"
              }`}
            >
              Väntande ({pendingApplications.length})
            </button>
          </div>
        </div>
      </Card>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "pending" && (
          <>
            {pendingApplications.length > 0 ? (
              pendingApplications.map((app) => (
                <VolunteerApplicationCard
                  key={app.applicationId}
                  application={app}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              ))
            ) : (
              <Card>
                <p className="text-center text-neutral-secondary py-8">Inga väntande ansökningar</p>
              </Card>
            )}
          </>
        )}

        {activeTab === "active" && (
          <>
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((volunteer) => (
                <ActiveVolunteerCard key={volunteer.volunteerId} volunteer={volunteer} />
              ))
            ) : (
              <Card>
                <p className="text-center text-neutral-secondary py-8">
                  {searchQuery
                    ? "Inga volontärer hittades"
                    : "Inga aktiva volontärer ännu. Godkänn ansökningar för att få volontärer."}
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};
