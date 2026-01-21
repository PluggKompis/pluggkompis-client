import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button, Input, Spinner } from "@/components/common";
import { volunteerService } from "@/services";
import { CreateVolunteerProfileRequest, Subject, VolunteerProfileSubjectFlat } from "@/types";

interface VolunteerProfileFormProps {
  profile?: {
    bio: string;
    experience: string;
    maxHoursPerWeek?: number;
    subjects: VolunteerProfileSubjectFlat[];
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export const VolunteerProfileForm: React.FC<VolunteerProfileFormProps> = ({
  profile,
  onSuccess,
  onCancel,
}) => {
  const [bio, setBio] = useState(profile?.bio || "");
  const [experience, setExperience] = useState(profile?.experience || "");
  const [maxHoursPerWeek, setMaxHoursPerWeek] = useState(
    profile?.maxHoursPerWeek?.toString() || ""
  );
  const [selectedSubjects, setSelectedSubjects] = useState<VolunteerProfileSubjectFlat[]>(
    profile?.subjects || []
  );

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!profile;

  // Fetch available subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  /**
   * Fetch all available subjects for dropdown
   */
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const result = await volunteerService.getAllSubjects();

      if (result.isSuccess && result.data) {
        setAvailableSubjects(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    if (!bio.trim()) {
      setError("Bio krävs");
      return false;
    }
    if (bio.trim().length < 50) {
      setError("Bio måste vara minst 50 tecken");
      return false;
    }
    if (!experience.trim()) {
      setError("Erfarenhet krävs");
      return false;
    }
    if (selectedSubjects.length === 0) {
      setError("Du måste välja minst ett ämne");
      return false;
    }
    if (maxHoursPerWeek && parseInt(maxHoursPerWeek) < 1) {
      setError("Timmar per vecka måste vara minst 1");
      return false;
    }
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data: CreateVolunteerProfileRequest = {
        bio: bio.trim(),
        experience: experience.trim(),
        maxHoursPerWeek: maxHoursPerWeek ? parseInt(maxHoursPerWeek) : undefined,
        subjects: selectedSubjects.map((s) => ({
          subjectId: s.subjectId,
          confidenceLevel: s.confidenceLevel,
        })),
      };

      console.log("Sending profile data:", data); // Debug logging
      console.log("Selected subjects:", selectedSubjects); // Debug logging

      let result;

      if (isEditing) {
        result = await volunteerService.updateProfile(data);
      } else {
        result = await volunteerService.createProfile(data);
      }

      if (result.isSuccess) {
        onSuccess();
      } else {
        setError(result.errors?.[0] || "Ett fel uppstod. Försök igen.");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Ett oväntat fel uppstod. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Add subject to selected list
   */
  const handleAddSubject = (subjectId: string) => {
    const subject = availableSubjects.find((s) => s.id === subjectId);
    if (!subject) return;

    // Check if already selected
    if (selectedSubjects.some((s) => s.subjectId === subjectId)) {
      return;
    }

    setSelectedSubjects([
      ...selectedSubjects,
      {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        confidenceLevel: "Beginner",
      },
    ]);
  };

  /**
   * Remove subject from selected list
   */
  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s.subjectId !== subjectId));
  };

  /**
   * Update confidence level for a subject
   */
  const handleConfidenceChange = (
    subjectId: string,
    level: "Beginner" | "Intermediate" | "Advanced"
  ) => {
    setSelectedSubjects(
      selectedSubjects.map((s) =>
        s.subjectId === subjectId ? { ...s, confidenceLevel: level } : s
      )
    );
  };

  // Get subjects not yet selected
  const unselectedSubjects = availableSubjects.filter(
    (subject) => !selectedSubjects.some((s) => s.subjectId === subject.id)
  );

  return (
    <div className="card">
      <h2 className="mb-6">{isEditing ? "Redigera profil" : "Skapa volontärprofil"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-error/10 border border-error rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Bio */}
        <div>
          <label className="input-label">
            Bio * <span className="text-xs text-neutral-secondary">(minst 50 tecken)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Berätta om dig själv..."
            className="input-field min-h-[120px] resize-y"
            disabled={isSubmitting}
            required
          />
          <p className="text-xs text-neutral-secondary mt-1">{bio.length} tecken</p>
        </div>

        {/* Experience */}
        <div>
          <label className="input-label">Erfarenhet *</label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="T.ex. 'Studerar till lärare', 'Har jobbat som mattelärare i 5 år'..."
            className="input-field min-h-[100px] resize-y"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Max Hours Per Week */}
        <Input
          label="Max timmar per vecka (valfritt)"
          type="number"
          value={maxHoursPerWeek}
          onChange={(e) => setMaxHoursPerWeek(e.target.value)}
          placeholder="10"
          min="1"
          max="40"
          disabled={isSubmitting}
          helperText="Hur många timmar per vecka kan du max hjälpa till?"
        />

        {/* Subjects */}
        <div>
          <label className="input-label">Ämnen *</label>

          {/* Selected Subjects */}
          {selectedSubjects.length > 0 && (
            <div className="space-y-3 mb-4">
              {selectedSubjects.map((subject) => (
                <div
                  key={subject.subjectId}
                  className="flex items-center gap-3 p-3 bg-neutral-bg rounded-lg"
                >
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-2xl">{subject.subjectIcon}</span>
                    <span className="font-medium">{subject.subjectName}</span>
                  </div>

                  {/* Confidence Level Dropdown */}
                  <select
                    value={subject.confidenceLevel}
                    onChange={(e) =>
                      handleConfidenceChange(
                        subject.subjectId,
                        e.target.value as "Beginner" | "Intermediate" | "Advanced"
                      )
                    }
                    className="px-3 py-2 rounded-lg border border-neutral-stroke text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="Beginner">Nybörjare</option>
                    <option value="Intermediate">Erfaren</option>
                    <option value="Advanced">Expert</option>
                  </select>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(subject.subjectId)}
                    className="p-1.5 hover:bg-error/10 rounded-lg text-error transition-colors"
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Subject Dropdown */}
          {loadingSubjects ? (
            <div className="text-center py-4">
              <Spinner size="sm" />
            </div>
          ) : unselectedSubjects.length > 0 ? (
            <div className="flex gap-2">
              <select
                className="input-field flex-1"
                disabled={isSubmitting}
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddSubject(e.target.value);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
              >
                <option value="">Välj ett ämne att lägga till...</option>
                {unselectedSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>
            </div>
          ) : selectedSubjects.length > 0 ? (
            <p className="text-sm text-neutral-secondary">Alla ämnen har lagts till!</p>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            {isSubmitting ? "Sparar..." : isEditing ? "Uppdatera profil" : "Skapa profil"}
          </Button>
        </div>
      </form>
    </div>
  );
};
