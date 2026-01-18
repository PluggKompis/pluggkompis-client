import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Card } from "@/components/common";
import { User, Mail, Calendar, ArrowLeft } from "lucide-react";
import { UserRole } from "@/types";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Convert numeric role to role name
  const getRoleName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      [UserRole.Coordinator]: "Koordinator",
      [UserRole.Volunteer]: "Volontär",
      [UserRole.Parent]: "Förälder",
      [UserRole.Student]: "Elev",
    };
    return roleNames[role] || "Okänd roll";
  };

  // Determine dashboard route based on user role
  const getDashboardRoute = () => {
    const roleRoutes: Record<UserRole, string> = {
      [UserRole.Parent]: "/parent",
      [UserRole.Volunteer]: "/volunteer",
      [UserRole.Coordinator]: "/coordinator",
      [UserRole.Student]: "/student",
    };

    return roleRoutes[user.role] || "/";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Min Profil</h1>

      <div className="mb-8 flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate(getDashboardRoute())}
          className="text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Tillbaka till instrumentpanel
        </button>
        <span className="text-neutral-secondary">/</span>
        <span className="text-neutral-secondary">Min Profil</span>
      </div>
      <div className="max-w-2xl">
        <Card>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>

            <div className="flex-1">
              <h2 className="mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-primary font-semibold mb-4">
                {getRoleName(user.role)} {/* Display role name */}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-secondary">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-secondary">
                  <Calendar size={18} />
                  <span>Medlem sedan {new Date(user.createdAt).toLocaleDateString("sv-SE")}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* TODO: Add edit profile functionality */}
        <div className="mt-6">
          <Card>
            <h3 className="mb-4">Kontohantering</h3>
            <p className="text-neutral-secondary text-sm">
              Funktioner för att redigera profil och byta lösenord kommer snart...
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
