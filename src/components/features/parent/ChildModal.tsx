import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Spinner } from "@/components/common";
import { Child, AddChildRequest, UpdateChildRequest } from "@/types";
import { parentService } from "@/services/parentService";
import { AlertCircle } from "lucide-react";

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Called after successful add/update
  child?: Child; // If editing, pass existing child
}

export const ChildModal: React.FC<ChildModalProps> = ({ isOpen, onClose, onSuccess, child }) => {
  const [firstName, setFirstName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [schoolGrade, setSchoolGrade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!child;

  // Pre-fill form when editing, reset when adding new
  useEffect(() => {
    if (child) {
      setFirstName(child.firstName);
      setBirthYear(child.birthYear.toString());
      setSchoolGrade(child.schoolGrade || "");
    } else {
      // Reset form when adding new
      setFirstName("");
      setBirthYear("");
      setSchoolGrade("");
    }
    setError("");
  }, [child, isOpen]);

  // Validate form inputs - Returns true if valid, false if invalid (and sets error message)
  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      setError("Förnamn krävs");
      return false;
    }
    if (!birthYear) {
      setError("Födelseår krävs");
      return false;
    }
    if (!schoolGrade.trim()) {
      setError("Årskurs krävs");
      return false;
    }

    const birthYearNum = parseInt(birthYear);
    const currentYear = new Date().getFullYear();

    if (birthYearNum < 1900 || birthYearNum > currentYear) {
      setError("Ogiltigt födelseår");
      return false;
    }

    return true;
  };

  // Handle form submission - either add or update child
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const childData: AddChildRequest | UpdateChildRequest = {
        firstName: firstName.trim(),
        birthYear: parseInt(birthYear),
        schoolGrade: schoolGrade.trim(),
      };

      let result;

      if (isEditing && child) {
        // Update existing child
        result = await parentService.updateChild(child.id, childData as UpdateChildRequest);
      } else {
        // Add new child
        result = await parentService.addChild(childData as AddChildRequest);
      }

      if (result.isSuccess) {
        onSuccess(); // Notify parent component
        onClose(); // Close modal
      } else {
        setError(result.errors?.[0] || "Ett fel uppstod. Försök igen.");
      }
    } catch (err) {
      console.error("Failed to save child:", err);
      setError("Ett oväntat fel uppstod. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Redigera barn" : "Lägg till barn"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-error/10 border border-error rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* First Name */}
        <Input
          label="Förnamn *"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Anna"
          disabled={isSubmitting}
          required
        />

        {/* Birth Year */}
        <Input
          label="Födelseår *"
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="2015"
          min="2000"
          max={new Date().getFullYear().toString()}
          disabled={isSubmitting}
          required
        />

        {/* School Grade */}
        <Input
          label="Årskurs *"
          type="text"
          value={schoolGrade}
          onChange={(e) => setSchoolGrade(e.target.value)}
          placeholder="5"
          disabled={isSubmitting}
          required
          helperText="T.ex. '5', 'Förskoleklass', 'Gymnasiet år 2'"
        />

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting && <Spinner size="sm" />}
            {isSubmitting ? "Sparar..." : isEditing ? "Uppdatera" : "Lägg till"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
