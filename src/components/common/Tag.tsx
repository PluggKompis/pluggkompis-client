import React from "react";

export interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "subject" | "neutral";
  icon?: string;
  className?: string;
}

const variantMap = {
  default: "tag-default",
  success: "tag-success",
  error: "tag-error",
  warning: "tag-warning",
  subject: "tag-subject",
  neutral: "tag-neutral",
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = "default",
  icon,
  className = "",
}) => {
  return (
    <span className={`tag ${variantMap[variant]} ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </span>
  );
};
