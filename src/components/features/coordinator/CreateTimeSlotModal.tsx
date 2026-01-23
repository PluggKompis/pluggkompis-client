import React, { useState, useEffect } from "react";
import { X, AlertCircle, Clock, Users, Calendar } from "lucide-react";
import { Button, Input } from "../../common";
import { timeSlotService, volunteerService } from "@/services";
import {
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,
  WeekDay,
  WeekDayLabels,
  Subject,
  TimeSlotSummary,
  TimeSlotStatus,
} from "@/types";

interface CreateTimeSlotModalProps {
  venueId: string;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: TimeSlotSummary | null; // Data for editing
}

export const CreateTimeSlotModal: React.FC<CreateTimeSlotModalProps> = ({
  venueId,
  onClose,
  onSuccess,
  initialData,
}) => {
  const isEditing = !!initialData;

  // Helper to convert "16:00:00" -> "16:00" for input field
  const parseTime = (timeStr?: string) => (timeStr ? timeStr.substring(0, 5) : "");

  const [formData, setFormData] = useState<{
    dayOfWeek: WeekDay;
    startTime: string;
    endTime: string;
    maxStudents: string;
    isRecurring: boolean;
    specificDate: string;
    recurringStartDate: string;
    recurringEndDate: string;
    subjectIds: string[];
  }>({
    // If editing, use existing data. Else defaults.
    dayOfWeek: initialData ? (initialData.dayOfWeek as unknown as WeekDay) : WeekDay.Monday,
    startTime: initialData ? parseTime(initialData.startTime) : "16:00",
    endTime: initialData ? parseTime(initialData.endTime) : "18:00",
    maxStudents: initialData ? initialData.maxStudents.toString() : "10",
    isRecurring: initialData ? initialData.isRecurring : true,

    // Dates (handle potential nulls from backend)
    specificDate: initialData?.specificDate || "",
    recurringStartDate: initialData?.recurringStartDate || "",
    recurringEndDate: initialData?.recurringEndDate || "",

    // Map existing subjects to IDs
    subjectIds: initialData ? initialData.subjects.map((s) => s.id) : [],
  });

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Fetch subjects on mount
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

  // Auto-sync DayOfWeek when Specific Date changes (One-Off Logic)
  useEffect(() => {
    // Only auto-sync if NOT editing (or if user changes date manually while editing)
    // We don't want to overwrite the loaded day immediately if the date format differs slightly
    if (!formData.isRecurring && formData.specificDate) {
      const date = new Date(formData.specificDate);
      const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday...

      const dayMap: Record<number, WeekDay> = {
        1: WeekDay.Monday,
        2: WeekDay.Tuesday,
        3: WeekDay.Wednesday,
        4: WeekDay.Thursday,
        5: WeekDay.Friday,
        6: WeekDay.Saturday,
        0: WeekDay.Sunday,
      };

      if (dayMap[jsDay]) {
        setFormData((prev) => ({ ...prev, dayOfWeek: dayMap[jsDay] }));
      }
    }
  }, [formData.specificDate, formData.isRecurring]);

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

    // --- Validation ---
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

    if (formData.isRecurring) {
      if (!formData.recurringStartDate) {
        setError("Du måste välja ett startdatum");
        return;
      }
      if (formData.recurringEndDate && formData.recurringEndDate < formData.recurringStartDate) {
        setError("Slutdatum kan inte vara före startdatum");
        return;
      }
    } else {
      if (!formData.specificDate) {
        setError("Välj ett specifikt datum");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Determine correct Day Number (0-6)
      const weekDayMap: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
      };

      let finalDayNumber: number;
      if (formData.isRecurring) {
        // Use dropdown value
        finalDayNumber = weekDayMap[formData.dayOfWeek] ?? 1;
      } else {
        // Calculate from date
        const dateObj = new Date(formData.specificDate);
        finalDayNumber = dateObj.getDay();
      }

      // Shared Data Payload
      const commonData = {
        dayOfWeek: finalDayNumber as unknown as WeekDay,
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
        maxStudents,
        isRecurring: formData.isRecurring,
        specificDate: formData.isRecurring ? undefined : formData.specificDate,
        recurringStartDate: formData.isRecurring ? formData.recurringStartDate : undefined,
        recurringEndDate: formData.isRecurring ? formData.recurringEndDate || undefined : undefined,
        subjectIds: formData.subjectIds,
      };

      let result;

      if (isEditing && initialData) {
        // --- UPDATE MODE ---
        const updateRequest: UpdateTimeSlotRequest = {
          ...commonData,
          status: initialData.status as TimeSlotStatus, // Maintain existing status
        };
        result = await timeSlotService.updateTimeSlot(initialData.id, updateRequest);
      } else {
        // --- CREATE MODE ---
        const createRequest: CreateTimeSlotRequest = {
          ...commonData,
          venueId: venueId,
        };
        result = await timeSlotService.createTimeSlot(createRequest);
      }

      if (result.isSuccess) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(result.errors?.[0] || `Kunde inte ${isEditing ? "uppdatera" : "skapa"} tidspass`);
      }
    } catch (err) {
      console.error("Failed to save timeslot:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-stroke p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">
            {isEditing ? "Redigera tidspass" : "Skapa nytt tidspass"}
          </h2>
          <button onClick={onClose} disabled={isSubmitting || showSuccess}>
            <X size={24} className="text-neutral-secondary hover:text-neutral-primary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {showSuccess && (
            <div className="p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3">
              <p className="text-success font-medium">
                Tidspasset har {isEditing ? "sparats" : "skapats"}!
              </p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Type Toggle (Disabled if editing to avoid complex logic switching types) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-primary" />
              <h3 className="font-semibold">Typ av pass</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => !isEditing && handleRecurringToggle(true)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.isRecurring
                    ? "border-primary bg-primary/5"
                    : "border-neutral-stroke hover:border-primary/50"
                } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className="font-semibold mb-1">Återkommande</p>
                <p className="text-xs text-neutral-secondary">Varje vecka samma dag</p>
              </button>
              <button
                type="button"
                onClick={() => !isEditing && handleRecurringToggle(false)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  !formData.isRecurring
                    ? "border-primary bg-primary/5"
                    : "border-neutral-stroke hover:border-primary/50"
                } ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className="font-semibold mb-1">Engångspass</p>
                <p className="text-xs text-neutral-secondary">Specifikt datum</p>
              </button>
            </div>
            {isEditing && (
              <p className="text-xs text-neutral-secondary">
                Du kan inte ändra typ av pass vid redigering.
              </p>
            )}
          </div>

          {/* Date & Day Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold">När?</h3>
            {formData.isRecurring ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Veckodag</label>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gäller från <span className="text-error">*</span>
                    </label>
                    <Input
                      type="date"
                      name="recurringStartDate"
                      value={formData.recurringStartDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gäller till (Valfritt)</label>
                    <Input
                      type="date"
                      name="recurringEndDate"
                      value={formData.recurringEndDate}
                      onChange={handleChange}
                      min={formData.recurringStartDate}
                      placeholder="Tills vidare"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Datum</label>
                <Input
                  type="date"
                  name="specificDate"
                  value={formData.specificDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required={!formData.isRecurring}
                />
              </div>
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

          {/* Capacity */}
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
                required
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              Ämnen <span className="text-error">*</span>
            </h3>
            {loadingSubjects ? (
              <p className="text-sm text-neutral-secondary">Laddar ämnen...</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableSubjects.map((subject) => (
                  <label
                    key={subject.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.subjectIds.includes(subject.id) ? "border-primary bg-primary/5" : "border-neutral-stroke hover:border-primary/50"}`}
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
              {isSubmitting ? "Sparar..." : isEditing ? "Spara ändringar" : "Skapa tidspass"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
