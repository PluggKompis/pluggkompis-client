import React from "react";
import { FileText } from "lucide-react"; // add Clock, CheckCircle, XCircle
import { EmptyState } from "@/components/common"; // add Card,

export const MyApplications: React.FC = () => {
  // TODO: Connect to backend endpoint GET /api/volunteers/me/applications
  // When backend is ready, fetch applications and display them here

  return (
    <div>
      <h2 className="mb-6">Mina Ansökningar</h2>

      {/* Placeholder - Replace with real data when backend is ready */}
      <EmptyState
        icon={FileText}
        title="Inga ansökningar ännu"
        description="När du söker till en plats kommer dina ansökningar att visas här. Du kan se status för varje ansökan och följa upp med koordinatorer."
      />

      {/* 
        When backend endpoint exists, show applications grouped by status:
        
        <div className="space-y-6">
          {/* Pending Applications *}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-warning" />
              Väntande ansökningar
            </h3>
            <div className="space-y-3">
              {pendingApplications.map((app) => (
                <Card key={app.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{app.venueName}</h4>
                      <p className="text-sm text-neutral-secondary">{app.venueCity}</p>
                      <p className="text-xs text-neutral-secondary mt-2">
                        Ansökt {new Date(app.appliedAt).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    <span className="tag tag-warning">Väntande</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Approved Applications *}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-success" />
              Godkända ansökningar
            </h3>
            <div className="space-y-3">
              {approvedApplications.map((app) => (
                <Card key={app.id} className="border-success/20 bg-success/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{app.venueName}</h4>
                      <p className="text-sm text-neutral-secondary">{app.venueCity}</p>
                      <p className="text-xs text-neutral-secondary mt-2">
                        Godkänd {new Date(app.approvedAt).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    <span className="tag tag-success">Godkänd</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Declined Applications *}
          {declinedApplications.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <XCircle size={20} className="text-error" />
                Avslagna ansökningar
              </h3>
              <div className="space-y-3">
                {declinedApplications.map((app) => (
                  <Card key={app.id} className="opacity-60">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{app.venueName}</h4>
                        <p className="text-sm text-neutral-secondary">{app.venueCity}</p>
                        <p className="text-xs text-neutral-secondary mt-2">
                          Avslagen {new Date(app.rejectedAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                      <span className="tag tag-error">Avslagen</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      */}
    </div>
  );
};
