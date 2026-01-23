// src/pages/ProfilePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Card, Button } from "@/components/common";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { User, Mail, Calendar, ArrowLeft, Lock, Trash2, Edit2, CheckCircle } from "lucide-react";
import { UserRole } from "@/types";
import { userService } from "@/services";

import { EditProfileModal } from "@/components/features/profile/EditProfileModal";
import { ChangePasswordModal } from "@/components/features/profile/ChangePasswordModal";

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const handleProfileUpdateSuccess = async () => {
    await refreshUserData();
    setSuccessMessage("Profilen har uppdaterats!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePasswordChangeSuccess = () => {
    setSuccessMessage("Lösenordet har uppdaterats!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      const result = await userService.deleteAccount();

      if (result.isSuccess) {
        logout();
        navigate("/login");
      } else {
        setError(result.errors?.[0] || "Kunde inte avsluta kontot.");
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error(err);
      setError("Ett oväntat fel uppstod.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      [UserRole.Coordinator]: "Koordinator",
      [UserRole.Volunteer]: "Volontär",
      [UserRole.Parent]: "Förälder",
      [UserRole.Student]: "Elev",
    };
    return roleNames[role] || "Okänd roll";
  };

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

      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-success text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={24} />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

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

      <div className="max-w-2xl space-y-6">
        {/* Personal Info */}
        <Card>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">Personuppgifter</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditProfile(true)}
              className="flex items-center gap-2"
            >
              <Edit2 size={16} />
              Redigera
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={40} className="text-primary" />
            </div>

            <div className="flex-1 w-full">
              <div className="mb-4">
                <h2 className="text-2xl font-bold leading-tight">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-primary font-medium mt-1">{getRoleName(user.role)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-primary">
                  <Mail size={18} className="text-neutral-secondary" />
                  <span>{user.email}</span>
                </div>
                {/* Phone number display removed here */}
                <div className="flex items-center gap-3 text-neutral-primary">
                  <Calendar size={18} className="text-neutral-secondary" />
                  <span>Medlem sedan {new Date(user.createdAt).toLocaleDateString("sv-SE")}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Säkerhet & Konto</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-neutral-stroke">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Lock size={18} />
                  Lösenord
                </h3>
                <p className="text-sm text-neutral-secondary mt-1">
                  Byt lösenord regelbundet för högre säkerhet
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowChangePassword(true)}>
                Byt lösenord
              </Button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium text-error flex items-center gap-2">
                  <Trash2 size={18} />
                  Avsluta konto
                </h3>
                <p className="text-sm text-neutral-secondary mt-1">
                  Inaktiverar kontot och tar bort personuppgifter
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-error text-error hover:bg-error/5 hover:text-error hover:border-error"
              >
                Avsluta konto
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <EditProfileModal
        user={user}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSuccess={handleProfileUpdateSuccess}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={handlePasswordChangeSuccess}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Avsluta konto"
        message="Är du säker på att du vill avsluta ditt konto? Du kommer att loggas ut omedelbart."
        confirmLabel="Ja, avsluta konto"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
