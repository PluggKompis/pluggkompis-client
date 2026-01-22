import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Card, Button, Tag } from "../../common";
import { CoordinatorVolunteerApplication } from "@/types";

interface VolunteerApplicationCardProps {
  application: CoordinatorVolunteerApplication;
  onApprove: (applicationId: string) => Promise<void>;
  onDecline: (applicationId: string, reason?: string) => Promise<void>;
}

export const VolunteerApplicationCard: React.FC<VolunteerApplicationCardProps> = ({
  application,
  onApprove,
  onDecline,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(application.id);
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeclineClick = () => {
    setShowDeclineInput(true);
  };

  const handleDeclineConfirm = async () => {
    setIsDeclining(true);
    try {
      await onDecline(application.id, declineReason || undefined);
    } finally {
      setIsDeclining(false);
      setShowDeclineInput(false);
      setDeclineReason("");
    }
  };

  const handleDeclineCancel = () => {
    setShowDeclineInput(false);
    setDeclineReason("");
  };

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

            <p className="text-xs text-neutral-secondary">
              Ansökte {new Date(application.appliedAt).toLocaleDateString("sv-SE")}
            </p>

            {/* Decline reason input */}
            {showDeclineInput && (
              <div className="mt-3 p-3 bg-neutral-bg rounded-lg border border-neutral-stroke">
                <label className="block text-sm font-medium mb-2">
                  Anledning till avslag (valfritt)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="T.ex. 'Vi söker volontärer med andra ämnen just nu'"
                  className="w-full px-3 py-2 border border-neutral-stroke rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!showDeclineInput ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={isApproving || isDeclining}
              >
                {isApproving ? "..." : "✓ Godkänn"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclineClick}
                disabled={isApproving || isDeclining}
              >
                ✕ Avslå
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclineCancel}
                disabled={isDeclining}
              >
                Avbryt
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeclineConfirm}
                disabled={isDeclining}
                className="bg-error hover:bg-error/90"
              >
                {isDeclining ? "..." : "Bekräfta"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
