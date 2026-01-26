import React, { useState, useEffect, useCallback } from "react";
import { Baby, AlertCircle, CheckCircle } from "lucide-react";
import { Button, EmptyState } from "@/components/common";
import { ChildCard } from "./ChildCard";
import { ChildModal } from "./ChildModal";
import { parentService } from "@/services/parentService";
import type { Child } from "@/types";
import { useAuth } from "@/hooks";

export const ChildrenList: React.FC = () => {
  const { refreshUserData } = useAuth();

  // State management
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback States
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | undefined>();

  // ✅ FIX 1: Wrap fetchChildren in useCallback
  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await parentService.getMyChildren();

      if (result.isSuccess && result.data) {
        setChildren(result.data);
      } else {
        setChildren([]);
        if (!result.data) {
          // We only want to show error if we really failed to get the list
          // and it wasn't just empty
          // But if result.data is null/undefined it might mean empty or error depending on backend
          // Assuming result.errors implies real error
          if (result.errors?.length) {
            setError(result.errors[0]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setChildren([]);
      setError("Ett oväntat fel uppstod.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIX 2: Add fetchChildren to dependency array
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const handleAddChild = () => {
    setEditingChild(undefined);
    setIsModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setIsModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSaveSuccess = async () => {
    setIsModalOpen(false);
    setError(null);

    await fetchChildren();
    await refreshUserData();

    setSuccessMessage(editingChild ? "Barnet har uppdaterats." : "Barnet har lagts till.");
    setTimeout(() => setSuccessMessage(null), 3000);

    setEditingChild(undefined);
  };

  const handleDeleteChild = async (childId: string) => {
    setError(null);
    setSuccessMessage(null);

    const previousChildren = [...children];
    setChildren((prev) => prev.filter((c) => c.id !== childId));

    try {
      const result = await parentService.deleteChild(childId);

      if (result.isSuccess) {
        await refreshUserData();
        setSuccessMessage("Barnet har tagits bort.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setChildren(previousChildren);
        setError(result.errors?.[0] || "Kunde inte ta bort barn.");
      }
    } catch (err) {
      // ✅ FIX 3: Removed ': any'
      // Rollback UI
      setChildren(previousChildren);

      // Safe cast to access response structure
      // We assume it looks like an Axios error response
      const errorObj = err as { response?: { data?: { errors?: string[] } } };
      const backendError = errorObj?.response?.data?.errors?.[0];

      if (backendError) {
        if (backendError.includes("bookings exist")) {
          setError("Kan inte ta bort barnet eftersom det finns bokade pass. Avboka passen först.");
        } else {
          setError(backendError);
        }
      } else {
        console.error("Delete failed:", err);
        setError("Ett oväntat fel uppstod.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-neutral-secondary">Laddar barn...</div>
      </div>
    );
  }

  // Blocking Error (Only if no data)
  if (error && children.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchChildren} variant="outline" size="sm" className="mt-4">
          Försök igen
        </Button>
      </div>
    );
  }

  // Empty State
  if (!children || children.length === 0) {
    return (
      <>
        {successMessage && (
          <div className="mb-4 p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
            <p className="text-success font-medium">{successMessage}</p>
          </div>
        )}

        <EmptyState
          icon={Baby}
          title="Inga barn registrerade"
          description="Lägg till ditt första barn för att börja boka läxhjälp"
          action={{
            label: "Lägg till barn",
            onClick: handleAddChild,
          }}
        />
        <ChildModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSaveSuccess}
          child={editingChild}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-primary">Mina Barn</h2>
        <Button variant="primary" size="sm" onClick={handleAddChild}>
          + Lägg till barn
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-success font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-error font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {children.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onEdit={handleEditChild}
            onDelete={handleDeleteChild}
          />
        ))}
      </div>

      <ChildModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChild(undefined);
        }}
        onSuccess={handleSaveSuccess}
        child={editingChild}
      />
    </div>
  );
};
