import React, { useState, useEffect } from "react";
import { Baby } from "lucide-react";
import { Button, EmptyState } from "@/components/common";
import { ChildCard } from "./ChildCard";
import { ChildModal } from "./ChildModal";
import { parentService } from "@/services/parentService";
import type { Child } from "@/types";

export const ChildrenList: React.FC = () => {
  // State management
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | undefined>();

  // Fetch children on component mount
  useEffect(() => {
    fetchChildren();
  }, []);

  // Fetches all children for the logged-in parent
  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await parentService.getMyChildren();

      console.log("API Result:", result); // Debug logging

      if (result.isSuccess && result.data) {
        setChildren(result.data);
      } else {
        setChildren([]);
        setError(result.errors?.[0] || "Kunde inte hämta barn.");
      }
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setChildren([]);
      setError("Ett oväntat fel uppstod. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  // Opens modal in "add new child" mode
  const handleAddChild = () => {
    setEditingChild(undefined);
    setIsModalOpen(true);
  };

  // Opens modal in "edit child" mode
  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setIsModalOpen(true);
  };

  // Called when child is successfully saved (added or updated)
  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    setEditingChild(undefined);
    fetchChildren(); // Refresh the list to show latest data
  };

  // Handels child deletion
  const handleDeleteChild = async (childId: string) => {
    // Store current state for potential rollback
    const previousChildren = [...children];

    // Optimistic update - remove from UI immediately
    setChildren((prev) => prev.filter((c) => c.id !== childId));

    try {
      // Attempt deletion
      const result = await parentService.deleteChild(childId);

      if (!result.isSuccess) {
        // Rollback on failure
        setChildren(previousChildren);
        setError(result.errors?.[0] || "Kunde inte ta bort barn.");
      }
    } catch (err) {
      // Rollback on error
      console.error("Delete failed:", err);
      setChildren(previousChildren);
      setError("Ett oväntat fel uppstod.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-neutral-secondary">Laddar barn...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchChildren} variant="outline" size="sm" className="mt-4">
          Försök igen
        </Button>
      </div>
    );
  }

  // Empty state - no children registered yet
  if (!children || children.length === 0) {
    return (
      <>
        <EmptyState
          icon={Baby}
          title="Inga barn registrerade"
          description="Lägg till ditt första barn för att börja boka läxhjälp"
          action={{
            label: "Lägg till barn",
            onClick: handleAddChild,
          }}
        />

        {/* Modal for adding first child */}
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
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-primary">Mina Barn</h2>
        <Button variant="primary" size="sm" onClick={handleAddChild}>
          + Lägg till barn
        </Button>
      </div>

      {/* Children cards */}
      <div className="space-y-3">
        {Array.isArray(children) &&
          children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onEdit={handleEditChild}
              onDelete={handleDeleteChild}
            />
          ))}
      </div>

      {/* Modal for add/edit */}
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
