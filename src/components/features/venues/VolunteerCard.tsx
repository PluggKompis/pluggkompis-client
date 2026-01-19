import React from "react";
import { Card, Tag } from "../../common";
import { User, Briefcase } from "lucide-react";

interface VolunteerCardProps {
  volunteer: {
    volunteerId: string;
    volunteerName: string;
    bio?: string;
    experience?: string;
    subjects:
      | string[]
      | Array<{
          name: string;
          confidenceLevel?: "Beginner" | "Intermediate" | "Expert";
        }>;
  };
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer }) => {
  // Helper to normalize subjects to consistent format
  const normalizeSubject = (subject: string | { name: string; confidenceLevel?: string }) => {
    if (typeof subject === "string") {
      return { name: subject, confidenceLevel: undefined };
    }
    return subject;
  };

  // Map confidence levels to Swedish text and colors
  const getConfidenceBadge = (level?: string) => {
    if (!level) return null;

    const badges = {
      Expert: { text: "Expert", variant: "success" as const },
      Intermediate: { text: "Erfaren", variant: "warning" as const },
      Beginner: { text: "Nybörjare", variant: "error" as const },
    };

    const badge = badges[level as keyof typeof badges];
    if (!badge) return null;

    return (
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
          badge.variant === "success"
            ? "bg-success/20 text-success"
            : badge.variant === "warning"
              ? "bg-warning/20 text-warning"
              : "bg-neutral-bg text-neutral-secondary"
        }`}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <div className="space-y-4">
        {/* Header with Name */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{volunteer.volunteerName}</h3>
          </div>
        </div>

        {/* Bio */}
        {volunteer.bio && (
          <p className="text-sm text-neutral-secondary line-clamp-3">{volunteer.bio}</p>
        )}

        {/* Experience */}
        {volunteer.experience && (
          <div className="flex items-start gap-2">
            <Briefcase size={16} className="text-neutral-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-neutral-secondary uppercase mb-1">
                Erfarenhet
              </p>
              <p className="text-sm">{volunteer.experience}</p>
            </div>
          </div>
        )}

        {/* Subjects with Confidence Levels */}
        <div>
          <p className="text-xs font-semibold text-neutral-secondary uppercase mb-2">
            Ämnen som jag hjälper till med
          </p>
          <div className="flex flex-wrap gap-2">
            {volunteer.subjects.map((subject, idx) => {
              const normalized = normalizeSubject(subject);
              return (
                <div key={idx} className="flex flex-col gap-1">
                  <Tag variant="subject">{normalized.name}</Tag>
                  {getConfidenceBadge(normalized.confidenceLevel)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
