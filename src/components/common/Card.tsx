import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = "",
  onClick,
}) => {
  const isClickable = !!onClick;

  return (
    <div className={`card ${isClickable ? "cursor-pointer" : ""} ${className}`} onClick={onClick}>
      {title && (
        <div className="mb-4">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="text-sm text-neutral-secondary mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="card-body">{children}</div>
    </div>
  );
};
