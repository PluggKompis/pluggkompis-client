import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="input-label">{label}</label>}

      <input className={`input-field ${error ? "border-error" : ""} ${className}`} {...props} />

      {error && <p className="input-error">{error}</p>}

      {helperText && !error && <p className="text-sm text-neutral-secondary mt-1">{helperText}</p>}
    </div>
  );
};
