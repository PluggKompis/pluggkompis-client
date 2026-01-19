import React, { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  icon,
  className = "",
  children,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-neutral-text mb-2">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-secondary pointer-events-none">
            {icon}
          </div>
        )}

        <select
          className={`
            w-full px-3 py-2 border border-neutral-stroke rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:bg-neutral-bg disabled:cursor-not-allowed
            disabled:text-neutral-secondary
            transition-colors
            appearance-none
            bg-white
            ${icon ? "pl-10" : ""}
            ${error ? "border-error focus:ring-error" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>

        {/* Chevron Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-neutral-secondary">
          <ChevronDown size={18} />
        </div>
      </div>

      {error && <p className="text-sm text-error mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-neutral-secondary mt-1">{helperText}</p>}
    </div>
  );
};
