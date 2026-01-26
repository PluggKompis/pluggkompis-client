import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
  path: string;
  label: string;
}

interface NavigationProps {
  links: NavLink[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ links, className = "" }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={className}>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`header-link ${isActive(link.path) ? "header-link-active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
