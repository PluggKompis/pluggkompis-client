// src/components/features/coordinator/CreateTimeSlotModal.tsx
import React, { useState, useEffect } from "react";
import { X, AlertCircle, Clock, Users, Calendar } from "lucide-react";
import { Button, Input } from "../../common";
import { timeSlotService, volunteerService } from "@/services";
import { CreateTimeSlotRequest, WeekDay, WeekDayLabels, Subject } from "@/types";

interface CreateTimeSlotModalProps {
  venueId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTimeSlotModal: React.FC<CreateTimeSlotModalProps> = ({
  venueId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<{
    dayOfWeek: WeekDay;
    startTime: string;
    endTime: string;
    maxStudents: string;
    isRecurring: boolean;
    specificDate: string;
    subjectIds: string[];
  }>({
    dayOfWeek: WeekDay.Monday,
    startTime: "16:00",
    endTime: "18:00",
    maxStudents: "10",
    isRecurring: true,
    specificDate: "",
    subjectIds: [],
  });

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Fetch available subjects
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecurringToggle = (isRecurring: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isRecurring,
      specificDate: isRecurring ? "" : prev.specificDate,
    }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter((id) => id !== subjectId)
        : [...prev.subjectIds, subjectId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.startTime || !formData.endTime) {
      setError("Start- och sluttid är obligatoriska");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("Sluttid måste vara efter starttid");
      return;
    }

    const maxStudents = parseInt(formData.maxStudents);
    if (isNaN(maxStudents) || maxStudents < 1) {
      setError("Max antal elever måste vara minst 1");
      return;
    }

    if (formData.subjectIds.length === 0) {
      setError("Välj minst ett ämne");
      return;
    }

    if (!formData.isRecurring && !formData.specificDate) {
      setError("Välj ett specifikt datum för engångspass");
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData: CreateTimeSlotRequest = {
        venueId: venueId,
        dayOfWeek: formData.dayOfWeek,
        startTime: `${formData.startTime}:00`, // Convert "16:00" to "16:00:00"
        endTime: `${formData.endTime}:00`,
        maxStudents,
        isRecurring: formData.isRecurring,
        specificDate: formData.isRecurring ? undefined : formData.specificDate,
        subjectIds: formData.subjectIds,
      };

      const result = await timeSlotService.createTimeSlot(requestData);

      if (result.isSuccess) {
        setShowSuccess(true);

        // Close modal after 2 seconds
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.errors?.[0] || "Kunde inte skapa tidspass");
      }
    } catch (err) {
      console.error("Failed to create timeslot:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-stroke p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Skapa nytt tidspass</h2>
          <button
            onClick={onClose}
            className="text-neutral-secondary hover:text-neutral-primary transition-colors"
            disabled={isSubmitting || showSuccess}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-success font-medium">Tidspasset har skapats!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Recurring or One-time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-primary" />
              <h3 className="font-semibold">Typ av pass</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRecurringToggle(true)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.isRecurring
                    ? "border-primary bg-primary/5"
                    : "border-neutral-stroke hover:border-primary/50"
                }`}
              >
                <p className="font-semibold mb-1">Återkommande</p>
                <p className="text-xs text-neutral-secondary">Varje vecka samma dag</p>
              </button>

              <button
                type="button"
                onClick={() => handleRecurringToggle(false)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  !formData.isRecurring
                    ? "border-primary bg-primary/5"
                    : "border-neutral-stroke hover:border-primary/50"
                }`}
              >
                <p className="font-semibold mb-1">Engångspass</p>
                <p className="text-xs text-neutral-secondary">Specifikt datum</p>
              </button>
            </div>
          </div>

          {/* Day Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">{formData.isRecurring ? "Veckodag" : "Datum"}</h3>

            {formData.isRecurring ? (
              <select
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                {Object.entries(WeekDayLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type="date"
                name="specificDate"
                value={formData.specificDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required={!formData.isRecurring}
              />
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <h3 className="font-semibold">Tid</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Starttid <span className="text-error">*</span>
                </label>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sluttid <span className="text-error">*</span>
                </label>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Max Students */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-primary" />
              <h3 className="font-semibold">Kapacitet</h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max antal elever <span className="text-error">*</span>
              </label>
              <Input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                min="1"
                placeholder="10"
                required
              />
            </div>
          </div>

          {/* Subjects Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              Ämnen <span className="text-error">*</span>
            </h3>
            <p className="text-sm text-neutral-secondary">
              Välj vilka ämnen som erbjuds under detta pass
            </p>

            {loadingSubjects ? (
              <p className="text-sm text-neutral-secondary">Laddar ämnen...</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableSubjects.map((subject) => (
                  <label
                    key={subject.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.subjectIds.includes(subject.id)
                        ? "border-primary bg-primary/5"
                        : "border-neutral-stroke hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjectIds.includes(subject.id)}
                      onChange={() => handleSubjectToggle(subject.id)}
                      className="w-4 h-4 text-primary border-neutral-stroke rounded focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-lg">{subject.icon}</span>
                    <span className="font-medium text-sm">{subject.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-stroke">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || showSuccess}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || showSuccess || loadingSubjects}
              className="flex-1"
            >
              {isSubmitting ? "Skapar..." : showSuccess ? "Skapat!" : "Skapa tidspass"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
