import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = "",
  onClick,
  ...rest
}) => {
  const isClickable = !!onClick;

  return (
    <div
      {...rest}
      className={`card ${isClickable ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
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
