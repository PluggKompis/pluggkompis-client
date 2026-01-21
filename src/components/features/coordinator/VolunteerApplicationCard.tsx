import React from "react";
import { Mail } from "lucide-react"; // add Phone icon when needed
import { Card, Button, Tag } from "../../common";
import { CoordinatorVolunteerApplication } from "@/types";

interface VolunteerApplicationCardProps {
  application: CoordinatorVolunteerApplication;
  onApprove: (applicationId: string) => void;
  onDecline: (applicationId: string) => void;
}

export const VolunteerApplicationCard: React.FC<VolunteerApplicationCardProps> = ({
  application,
  onApprove,
  onDecline,
}) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-neutral-bg rounded-full flex items-center justify-center text-neutral-secondary font-bold">
            {application.volunteerName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "V"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3>{application.volunteerName || "Volunteer"}</h3>
              <Tag variant="warning">Väntande</Tag>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2 text-sm text-neutral-secondary">
                <Mail size={14} />
                <span>{application.volunteerEmail}</span>
              </div>
            </div>

            {application.message && (
              <div className="bg-neutral-bg p-3 rounded-lg mb-2">
                <p className="text-sm font-semibold mb-1">Meddelande:</p>
                <p className="text-sm text-neutral-secondary">{application.message}</p>
              </div>
            )}

            <p className="text-xs text-neutral-secondary">
              Ansökte {new Date(application.appliedAt).toLocaleDateString("sv-SE")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="primary" size="sm" onClick={() => onApprove(application.id)}>
            ✓ Godkänn
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDecline(application.id)}>
            ✕ Avslå
          </Button>
        </div>
      </div>
    </Card>
  );
};
