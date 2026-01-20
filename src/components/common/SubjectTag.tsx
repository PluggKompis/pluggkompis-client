import React from "react";

interface SubjectTagProps {
  name: string;
  icon?: string;
}

export const SubjectTag: React.FC<SubjectTagProps> = ({ name, icon }) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
      {icon && <span className="text-sm">{icon}</span>}
      <span>{name}</span>
    </span>
  );
};
