import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Hem" },
    { path: "/components", label: "Test components" },
    { path: "/venues", label: "Hitta Läxhjälp" },
    { path: "/register", label: "Registrera dig" },
  ];

  return (
    <header className="header sticky top-0 z-50">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          PluggKompis
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex header-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header-link ${isActive(link.path) ? "header-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          <Link to="/login" className="btn btn-primary btn-sm">
            Logga in
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Meny"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-primary-dark border-t border-primary-light">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`header-link ${isActive(link.path) ? "header-link-active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/login"
              className="btn btn-primary btn-md w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Logga in
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
