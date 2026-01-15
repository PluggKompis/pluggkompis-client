import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantMap = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
};

const sizeMap = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  isLoading = false,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`btn ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Laddar...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
