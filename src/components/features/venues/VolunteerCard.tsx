import React from "react";
import { Card, SubjectTag } from "../../common";
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
          icon?: string;
          confidenceLevel?: "Beginner" | "Intermediate" | "Advanced";
        }>
      | Array<{
          subject: {
            id: string;
            name: string;
            icon: string;
          };
          confidenceLevel: "Beginner" | "Intermediate" | "Advanced";
        }>;
  };
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer }) => {
  const normalizeSubject = (
    subject:
      | string
      | { name: string; icon?: string; confidenceLevel?: string }
      | { subject: { id: string; name: string; icon: string }; confidenceLevel?: string }
  ): { id?: string; name: string; icon?: string; confidenceLevel?: string } => {
    // String case
    if (typeof subject === "string") {
      return { name: subject, icon: undefined, confidenceLevel: undefined };
    }

    // Nested structure from backend (has 'subject' property)
    if ("subject" in subject && subject.subject) {
      return {
        id: subject.subject.id,
        name: subject.subject.name,
        icon: subject.subject.icon,
        confidenceLevel: subject.confidenceLevel,
      };
    }

    // Flat structure (has 'name' property directly)
    if ("name" in subject) {
      return {
        name: subject.name,
        icon: subject.icon,
        confidenceLevel: subject.confidenceLevel,
      };
    }

    // Fallback (should never reach here, but satisfies TypeScript)
    return { name: "Unknown", icon: undefined, confidenceLevel: undefined };
  };

  // Map confidence levels to Swedish text and colors
  const getConfidenceBadge = (level?: string) => {
    if (!level) return null;

    const badges = {
      Advanced: {
        text: "Expert",
        className: "bg-confidence-advanced text-primary-dark", // Rich gold
      },
      Intermediate: {
        text: "Erfaren",
        className: "bg-confidence-intermediate text-primary-dark", // Medium amber
      },
      Beginner: {
        text: "Nybörjare",
        className: "bg-confidence-beginner text-primary-dark", // Light peach
      },
    };

    const badge = badges[level as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${badge.className}`}>
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
          <div className="space-y-1">
            {/* Icon + title */}
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-primary-dark flex-shrink-0" />
              <p className="text-primary-dark text-sm font-medium uppercase">Erfarenhet</p>
            </div>

            {/* Description – aligned with icon */}
            <p className="text-neutral-secondary text-sm">{volunteer.experience}</p>
          </div>
        )}

        {/* Subjects with Confidence Levels */}
        <div>
          <p className="text-primary-dark text-sm font-medium uppercase mb-2">
            Ämnen som jag hjälper till med
          </p>
          <div className="flex flex-wrap gap-3">
            {volunteer.subjects.map((subject, idx) => {
              const normalized = normalizeSubject(subject);
              // Use subject ID if available, otherwise fall back to index
              const key = normalized.id || `subject-${idx}`;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <SubjectTag name={normalized.name} icon={normalized.icon} />
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
