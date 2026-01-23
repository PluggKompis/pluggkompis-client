import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/components/common";
import { userService } from "@/services";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("De nya lösenorden matchar inte");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await userService.changePassword(formData);
      if (result.isSuccess) {
        onSuccess();
        onClose();
      } else {
        setError(result.errors?.[0] || "Kunde inte byta lösenord");
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
          <h2 className="text-xl font-bold">Byt lösenord</h2>
          <button onClick={onClose}>
            <X size={24} className="text-neutral-secondary" />
          </button>
        </div>

        {error && <div className="bg-error/10 text-error p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nuvarande lösenord</label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nytt lösenord</label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bekräfta nytt lösenord</label>
            <Input
              type="password"
              value={formData.confirmNewPassword}
              onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Avbryt
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? "Byter..." : "Byt lösenord"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
