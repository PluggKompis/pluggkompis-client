import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/common";
import { volunteerService } from "@/services/volunteerService";
import { ApplicationStatus, VolunteerApplication } from "@/types";

export const ApprovedVenues: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedVenues();
  }, []);

  const fetchApprovedVenues = async () => {
    try {
      const result = await volunteerService.getMyApplications();
      if (result.isSuccess && result.data) {
        const approved = result.data.filter((app) => app.status === ApplicationStatus.Approved);
        setApplications(approved);
      }
    } catch (err) {
      console.error("Failed to fetch approved venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueClick = (venueId: string) => {
    // Navigate to venue detail page with "about" tab active
    navigate(`/venues/${venueId}?tab=about`);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-secondary text-sm">
        <p className="mb-2">Du har inte blivit godkänd till några platser ännu.</p>
        <p className="text-xs">
          När en koordinator godkänner din ansökan kommer platsen att visas här.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {applications.map((app) => (
        <button
          key={app.applicationId}
          onClick={() => handleVenueClick(app.venueId)}
          className="w-full text-left p-3 bg-success/5 border border-success/20 rounded-lg hover:bg-success/10 hover:border-success/30 transition-colors group"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                {app.venueName}
              </p>
              <p className="text-xs text-neutral-secondary">{app.venueCity}</p>
              {app.reviewedAt && (
                <p className="text-xs text-neutral-secondary mt-1">
                  Godkänd {new Date(app.reviewedAt).toLocaleDateString("sv-SE")}
                </p>
              )}
            </div>

            <ArrowRight
              size={18}
              className="text-neutral-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
            />
          </div>
        </button>
      ))}
    </div>
  );
};
