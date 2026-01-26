import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../common";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">PluggKompis</h3>
            <p className="text-sm text-neutral-secondary">
              Gratis läxhjälp för alla barn i Sverige
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="footer-link">
                  Hem
                </Link>
              </li>
              <li>
                <Link to="/venues" className="footer-link">
                  Hitta Läxhjälp
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">
                  Registrera
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-semibold mb-4">Om PluggKompis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/om-pluggkompis" className="footer-link">
                  Om PluggKompis
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h4 className="font-semibold mb-4">Bli Volontär</h4>
            <p className="text-sm text-neutral-secondary mb-4">Hjälp barn med deras läxor</p>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Bli Volontär
              </Button>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-stroke text-center text-sm text-neutral-secondary">
          © PluggKompis, {currentYear}
        </div>
      </div>
    </footer>
  );
};
