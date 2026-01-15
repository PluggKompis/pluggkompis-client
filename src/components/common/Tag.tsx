import React from "react";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "subject";
  icon?: string;
  className?: string;
}

const variantMap = {
  default: "tag-default",
  success: "tag-success",
  error: "tag-error",
  warning: "tag-warning",
  subject: "tag-subject",
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
