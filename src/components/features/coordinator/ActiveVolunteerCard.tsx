// src/components/features/coordinator/ActiveVolunteerCard.tsx
import React from "react";
import { User } from "lucide-react";
import { Card, SubjectTag, Tag } from "../../common";
import { VolunteerProfileDto } from "@/types";

interface ActiveVolunteerCardProps {
  volunteer: VolunteerProfileDto;
}

export const ActiveVolunteerCard: React.FC<ActiveVolunteerCardProps> = ({ volunteer }) => {
  // Get confidence level badge styling
  const getConfidenceBadge = (level: string) => {
    const badges = {
      Advanced: {
        text: "Expert",
        className: "bg-confidence-advanced text-primary-dark",
      },
      Intermediate: {
        text: "Erfaren",
        className: "bg-confidence-intermediate text-primary-dark",
      },
      Beginner: {
        text: "Nybörjare",
        className: "bg-confidence-beginner text-primary-dark",
      },
    };

    const badge = badges[level as keyof typeof badges] || badges.Beginner;

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <Card>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={24} className="text-primary" />
        </div>

        {/* Volunteer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{volunteer.volunteerName}</h3>
            <Tag variant="success">Aktiv</Tag>
          </div>

          {/* Bio */}
          {volunteer.bio && (
            <p className="text-sm text-neutral-secondary mb-3 line-clamp-2">{volunteer.bio}</p>
          )}

          {/* Experience */}
          {volunteer.experience && (
            <p className="text-sm text-neutral-secondary mb-3 line-clamp-2">
              <span className="font-medium">Erfarenhet:</span> {volunteer.experience}
            </p>
          )}

          {/* Subjects */}
          {volunteer.subjects.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Ämnen:</p>
              <div className="flex flex-wrap gap-3">
                {volunteer.subjects.map((subjectData) => (
                  <div key={subjectData.subject.id} className="flex items-center gap-2">
                    <SubjectTag name={subjectData.subject.name} icon={subjectData.subject.icon} />
                    {getConfidenceBadge(subjectData.confidenceLevel)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
