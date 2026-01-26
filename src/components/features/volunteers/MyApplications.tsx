import React, { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, EmptyState, Spinner, Tag } from "@/components/common";
import { volunteerService } from "@/services";
import { VolunteerApplication, ApplicationStatus } from "@/types";

export const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await volunteerService.getMyApplications();

      if (result.isSuccess && result.data) {
        setApplications(result.data);
      } else {
        setError(result.errors?.[0] || "Kunde inte hämta ansökningar");
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  // Group applications by status
  const pendingApplications = applications.filter(
    (app) => app.status === ApplicationStatus.Pending
  );
  const approvedApplications = applications.filter(
    (app) => app.status === ApplicationStatus.Approved
  );
  const declinedApplications = applications.filter(
    (app) => app.status === ApplicationStatus.Declined
  );

  // Format date in Swedish
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-error font-medium">{error}</p>
            <button
              onClick={fetchApplications}
              className="text-sm text-error underline mt-2 hover:no-underline"
            >
              Försök igen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (applications.length === 0) {
    return (
      <div>
        <h2 className="mb-6">Mina Ansökningar</h2>
        <EmptyState
          icon={FileText}
          title="Inga ansökningar ännu"
          description="När du söker till en plats kommer dina ansökningar att visas här. Du kan se status för varje ansökan och följa upp med koordinatorer."
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6">Mina Ansökningar</h2>

      <div className="space-y-6">
        {/* Pending Applications */}
        {pendingApplications.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-warning" />
              Väntande ansökningar ({pendingApplications.length})
            </h3>
            <div className="space-y-3">
              {pendingApplications.map((app) => (
                <Card key={app.applicationId}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{app.venueName}</h4>
                      <p className="text-sm text-neutral-secondary">{app.venueCity}</p>
                      <p className="text-xs text-neutral-secondary mt-2">
                        Ansökt {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <Tag variant="warning">Väntande</Tag>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Approved Applications */}
        {approvedApplications.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-success" />
              Godkända ansökningar ({approvedApplications.length})
            </h3>
            <div className="space-y-3">
              {approvedApplications.map((app) => (
                <Card key={app.applicationId} className="border-success/20 bg-success/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{app.venueName}</h4>
                      <p className="text-sm text-neutral-secondary">{app.venueCity}</p>
                      {app.reviewedAt && (
                        <p className="text-xs text-neutral-secondary mt-2">
                          Godkänd {formatDate(app.reviewedAt)}
                        </p>
                      )}
                    </div>
                    <Tag variant="success">Godkänd</Tag>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Declined Applications */}
        {declinedApplications.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <XCircle size={20} className="text-error" />
              Avslagna ansökningar ({declinedApplications.length})
            </h3>
            <div className="space-y-3">
              {declinedApplications.map((app) => (
                <Card key={app.applicationId} className="opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{app.venueName}</h4>
                      <p className="text-sm text-neutral-secondary">{app.venueCity}</p>
                      {app.reviewedAt && (
                        <p className="text-xs text-neutral-secondary mt-2">
                          Avslagen {formatDate(app.reviewedAt)}
                        </p>
                      )}
                      {app.notes && (
                        <p className="text-xs text-neutral-secondary mt-2 italic">"{app.notes}"</p>
                      )}
                    </div>
                    <Tag variant="error">Avslagen</Tag>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
