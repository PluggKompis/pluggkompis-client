import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "../common";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  // Convert numeric role to display name
  const getRoleName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      [UserRole.Coordinator]: "Koordinator",
      [UserRole.Volunteer]: "Volontär",
      [UserRole.Parent]: "Förälder",
      [UserRole.Student]: "Elev",
    };
    return roleNames[role] || "Okänd roll";
  };

  return (
    <header className="bg-primary-dark text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {" "}
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-primary-light transition-colors">
            PluggKompis
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary-light transition-colors">
              Hem
            </Link>
            <Link to="/venues" className="hover:text-primary-light transition-colors">
              Hitta Läxhjälp
            </Link>
            <Link to="/register" className="hover:text-primary-light transition-colors">
              Registrera dig
            </Link>
          </nav>
          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                >
                  <User size={20} />
                  <span className="font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 py-2">
                      <div className="px-4 py-3 border-b border-neutral-stroke">
                        <p className="font-semibold text-black">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-neutral-secondary">{user.email}</p>
                        <p className="text-xs text-primary mt-1">{getRoleName(user.role)}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-black hover:bg-neutral-bg transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Min Profil
                      </Link>

                      {/* Role-specific dashboard links */}
                      {user.role === UserRole.Coordinator && (
                        <Link
                          to="/coordinator"
                          className="block px-4 py-2 text-black hover:bg-neutral-bg transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Koordinator Panel
                        </Link>
                      )}

                      {user.role === UserRole.Parent && (
                        <Link
                          to="/parent"
                          className="block px-4 py-2 text-black hover:bg-neutral-bg transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Föräldrapanel
                        </Link>
                      )}

                      {user.role === UserRole.Student && (
                        <Link
                          to="/student"
                          className="block px-4 py-2 text-black hover:bg-neutral-bg transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Elevpanel
                        </Link>
                      )}

                      {user.role === UserRole.Volunteer && (
                        <Link
                          to="/volunteer"
                          className="block px-4 py-2 text-black hover:bg-neutral-bg transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Volontärpanel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logga ut
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Logga in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Registrera
                  </Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-light">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="hover:text-primary-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hem
              </Link>
              <Link
                to="/venues"
                className="hover:text-primary-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hitta Läxhjälp
              </Link>
              <Link
                to="/register"
                className="hover:text-primary-light transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrera dig
              </Link>

              {isAuthenticated && user ? (
                <>
                  <div className="border-t border-primary-light pt-4 mt-2">
                    <p className="font-semibold mb-1">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-300 mb-1">{user.email}</p>
                    <p className="text-xs text-primary-light mb-3">{user.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Min Profil
                  </Link>

                  {/* Mobile role-specific links */}
                  {user.role === UserRole.Coordinator && (
                    <Link
                      to="/coordinator"
                      className="hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Koordinator Panel
                    </Link>
                  )}

                  {user.role === UserRole.Parent && (
                    <Link
                      to="/parent"
                      className="hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Föräldrapanel
                    </Link>
                  )}

                  {user.role === UserRole.Student && (
                    <Link
                      to="/student"
                      className="hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Elevpanel
                    </Link>
                  )}

                  {user.role === UserRole.Volunteer && (
                    <Link
                      to="/volunteer"
                      className="hover:text-primary-light transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Volontärpanel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left hover:text-primary-light transition-colors text-error"
                  >
                    Logga ut
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 border-t border-primary-light pt-4 mt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Logga in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Registrera
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
