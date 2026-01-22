import React, { useState, useEffect } from "react";
import { Card, Button, Input, Spinner, Modal } from "../../common";
import { coordinatorService } from "@/services";
import { CoordinatorShift, MarkAttendanceRequest } from "@/types";
import { Calendar, Clock, User, Check, X, AlertCircle, Edit } from "lucide-react";

export const AttendanceTracker: React.FC = () => {
  const [shifts, setShifts] = useState<CoordinatorShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "attended" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    shiftId: string | null;
    newStatus: boolean;
    volunteerName: string;
    currentStatus?: boolean;
  }>({
    isOpen: false,
    shiftId: null,
    newStatus: false,
    volunteerName: "",
  });

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
      const twoWeeksAhead = new Date(now);
      twoWeeksAhead.setDate(now.getDate() + 14);

      const result = await coordinatorService.getShifts({
        startUtc: twoWeeksAgo.toISOString(),
        endUtcExclusive: twoWeeksAhead.toISOString(),
        pageSize: 100,
      });

      if (result.isSuccess && result.data) {
        const sorted = result.data.items.sort(
          (a, b) =>
            new Date(b.occurrenceStartUtc).getTime() - new Date(a.occurrenceStartUtc).getTime()
        );
        setShifts(sorted);
      } else {
        setError(result.errors?.[0] || "Kunde inte hämta pass");
      }
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
      setError("Ett oväntat fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal
  const openConfirmModal = (shift: CoordinatorShift, newStatus: boolean) => {
    setConfirmModal({
      isOpen: true,
      shiftId: shift.shiftId,
      newStatus,
      volunteerName: shift.volunteerName,
      currentStatus: shift.isAttended !== null ? shift.isAttended : undefined,
    });
  };

  // Confirm and mark attendance
  const confirmMarkAttendance = async () => {
    if (!confirmModal.shiftId) return;

    try {
      const shift = shifts.find((s) => s.shiftId === confirmModal.shiftId);
      const data: MarkAttendanceRequest = {
        isAttended: confirmModal.newStatus,
        notes: shift?.notes || undefined,
      };

      const result = await coordinatorService.markAttendance(confirmModal.shiftId, data);

      if (result.isSuccess) {
        setShifts((prev) =>
          prev.map((s) =>
            s.shiftId === confirmModal.shiftId ? { ...s, isAttended: confirmModal.newStatus } : s
          )
        );

        // Show success message
        setSuccessMessage(
          `Status uppdaterad: ${confirmModal.volunteerName} markerad som ${
            confirmModal.newStatus ? "närvarande" : "frånvarande"
          }`
        );

        setConfirmModal({ isOpen: false, shiftId: null, newStatus: false, volunteerName: "" });
      } else {
        alert(result.errors?.[0] || "Kunde inte uppdatera närvaro");
        setConfirmModal({ isOpen: false, shiftId: null, newStatus: false, volunteerName: "" });
      }
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert("Ett oväntat fel uppstod");
      setConfirmModal({ isOpen: false, shiftId: null, newStatus: false, volunteerName: "" });
    }
  };

  const handleSaveNotes = async (shiftId: string) => {
    try {
      const shift = shifts.find((s) => s.shiftId === shiftId);
      if (!shift) return;

      const data: MarkAttendanceRequest = {
        isAttended: shift.isAttended,
        notes: editNotes.trim() || undefined,
      };

      const result = await coordinatorService.markAttendance(shiftId, data);

      if (result.isSuccess) {
        setShifts((prev) =>
          prev.map((s) =>
            s.shiftId === shiftId ? { ...s, notes: editNotes.trim() || undefined } : s
          )
        );
        setEditingShiftId(null);
        setEditNotes("");
        setSuccessMessage("Anteckningar sparade");
      } else {
        alert(result.errors?.[0] || "Kunde inte spara anteckningar");
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
      alert("Ett oväntat fel uppstod");
    }
  };

  // Check if shift has ended (can mark attendance)
  const hasShiftEnded = (shift: CoordinatorShift): boolean => {
    const now = new Date();
    const endTime = new Date(shift.occurrenceEndUtc);
    return now > endTime;
  };

  const filteredShifts = shifts.filter((shift) => {
    if (filter === "attended" && !shift.isAttended) return false;
    if (filter === "pending" && shift.isAttended) return false;

    if (searchTerm && !shift.volunteerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Group shifts by date
  const groupedShifts = filteredShifts.reduce(
    (acc, shift) => {
      const date = new Date(shift.occurrenceStartUtc).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    },
    {} as Record<string, CoordinatorShift[]>
  );

  const isChanging = confirmModal.currentStatus !== undefined;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-neutral-secondary">Laddar pass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error rounded-lg">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Närvarohantering</h2>
        <p className="text-sm text-neutral-secondary mt-1">
          Markera närvaro för volontärer och lägg till anteckningar
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-start gap-3 p-4 bg-success/10 border border-success rounded-lg">
          <Check size={20} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-success text-sm">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Sök volontär..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filter === "all" ? "bg-primary text-white" : "bg-neutral-bg hover:bg-neutral-stroke"
              }`}
            >
              Alla ({shifts.length})
            </button>
            <button
              onClick={() => setFilter("attended")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filter === "attended"
                  ? "bg-success text-white"
                  : "bg-neutral-bg hover:bg-neutral-stroke"
              }`}
            >
              Närvarande ({shifts.filter((s) => s.isAttended).length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filter === "pending"
                  ? "bg-warning text-white"
                  : "bg-neutral-bg hover:bg-neutral-stroke"
              }`}
            >
              Ej markerad ({shifts.filter((s) => !s.isAttended).length})
            </button>
          </div>
        </div>
      </Card>

      {/* Shifts grouped by date */}
      {Object.keys(groupedShifts).length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-neutral-secondary mb-4" />
            <p className="text-neutral-secondary">Inga pass hittades</p>
          </div>
        </Card>
      ) : (
        Object.entries(groupedShifts).map(([date, dayShifts]) => (
          <Card key={date}>
            <h3 className="mb-4 capitalize">{date}</h3>
            <div className="space-y-3">
              {dayShifts.map((shift) => {
                const shiftEnded = hasShiftEnded(shift);
                const hasStatus = shift.isAttended !== null;

                return (
                  <div
                    key={shift.shiftId}
                    className="p-4 bg-neutral-bg rounded-lg border border-neutral-stroke"
                  >
                    {/* Shift Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={18} className="text-primary" />
                          <p className="font-semibold">{shift.volunteerName}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-secondary">
                          <Clock size={16} />
                          <span>
                            {new Date(shift.occurrenceStartUtc).toLocaleTimeString("sv-SE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(shift.occurrenceEndUtc).toLocaleTimeString("sv-SE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Attendance Status UI */}
                      <div className="flex items-center gap-2">
                        {!shiftEnded ? (
                          // Future shift
                          <div className="px-4 py-2 bg-neutral-bg border border-neutral-stroke rounded-lg">
                            <p className="text-sm text-neutral-secondary">Pass ej genomfört ännu</p>
                          </div>
                        ) : !hasStatus ? (
                          // No status marked - show both buttons
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmModal(shift, true)}
                              className="border-success text-success hover:bg-success hover:text-white"
                            >
                              <Check size={16} className="mr-1" />
                              Närvarande
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmModal(shift, false)}
                              className="border-error text-error hover:bg-error hover:text-white"
                            >
                              <X size={16} className="mr-1" />
                              Frånvarande
                            </Button>
                          </>
                        ) : (
                          // Status marked - show badge + change button
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                                shift.isAttended ? "bg-success text-white" : "bg-error text-white"
                              }`}
                            >
                              {shift.isAttended ? (
                                <>
                                  <Check size={16} />
                                  Närvarande
                                </>
                              ) : (
                                <>
                                  <X size={16} />
                                  Frånvarande
                                </>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmModal(shift, !shift.isAttended)}
                            >
                              <Edit size={14} className="mr-1" />
                              Ändra
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-3 pt-3 border-t border-neutral-stroke">
                      {editingShiftId === shift.shiftId ? (
                        <div className="space-y-2">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Lägg till anteckningar om passet..."
                            className="w-full px-3 py-2 border border-neutral-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSaveNotes(shift.shiftId)}
                            >
                              Spara
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingShiftId(null);
                                setEditNotes("");
                              }}
                            >
                              Avbryt
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {shift.notes ? (
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-neutral-secondary italic">{shift.notes}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingShiftId(shift.shiftId);
                                  setEditNotes(shift.notes || "");
                                }}
                              >
                                Redigera
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingShiftId(shift.shiftId);
                                setEditNotes("");
                              }}
                            >
                              + Lägg till anteckningar
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))
      )}

      {/* Confirmation Modal using common Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, shiftId: null, newStatus: false, volunteerName: "" })
        }
        title={isChanging ? "Ändra närvarostatus?" : "Markera närvaro?"}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#E8A93F15" }}
            >
              <AlertCircle size={24} style={{ color: "#E8A93F" }} />
            </div>
            <p className="text-sm text-neutral-secondary">
              {isChanging ? (
                <>
                  Vill du ändra status för <strong>{confirmModal.volunteerName}</strong> från{" "}
                  <strong>{confirmModal.currentStatus ? "Närvarande" : "Frånvarande"}</strong> till{" "}
                  <strong>{confirmModal.newStatus ? "Närvarande" : "Frånvarande"}</strong>?
                </>
              ) : (
                <>
                  Markera <strong>{confirmModal.volunteerName}</strong> som{" "}
                  <strong>{confirmModal.newStatus ? "Närvarande" : "Frånvarande"}</strong>?
                </>
              )}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmModal({
                  isOpen: false,
                  shiftId: null,
                  newStatus: false,
                  volunteerName: "",
                })
              }
            >
              Avbryt
            </Button>
            <Button variant="primary" onClick={confirmMarkAttendance}>
              Bekräfta
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
