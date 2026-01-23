import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/components/common";
import { userService } from "@/services";
import { User, UpdateMyProfileDto } from "@/types";

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Initialize form with current user data
  const [formData, setFormData] = useState<UpdateMyProfileDto>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email, // Now editable
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await userService.updateProfile(formData);
      if (result.isSuccess) {
        onSuccess();
        onClose();
      } else {
        setError(result.errors?.[0] || "Kunde inte uppdatera profilen");
      }
    } catch (err) {
      console.error(err);
      setError("Ett fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Redigera profil</h2>
          <button onClick={onClose}>
            <X size={24} className="text-neutral-secondary hover:text-neutral-primary" />
          </button>
        </div>

        {error && <div className="bg-error/10 text-error p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Förnamn</label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Efternamn</label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-post</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Avbryt
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? "Sparar..." : "Spara ändringar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
