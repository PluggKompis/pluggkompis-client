// src/components/features/coordinator/AttendanceTracker.tsx
import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "../../common";
import { coordinatorService } from "@/services";
import { CoordinatorShift, MarkAttendanceRequest } from "@/types";
import { Calendar, Clock, User, Check, X, AlertCircle } from "lucide-react";

export const AttendanceTracker: React.FC = () => {
  const [shifts, setShifts] = useState<CoordinatorShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "attended" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch shifts for the past 2 weeks and next 2 weeks
      const now = new Date();
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
      const twoWeeksAhead = new Date(now);
      twoWeeksAhead.setDate(now.getDate() + 14);

      const result = await coordinatorService.getShifts({
        startUtc: twoWeeksAgo.toISOString(),
        endUtcExclusive: twoWeeksAhead.toISOString(),
        pageSize: 100, // Get up to 100 shifts
      });

      if (result.isSuccess && result.data) {
        // ACCESS .items from PaginatedResponse
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

  const handleMarkAttendance = async (shiftId: string, isAttended: boolean) => {
    try {
      const shift = shifts.find((s) => s.shiftId === shiftId);
      const data: MarkAttendanceRequest = {
        isAttended,
        notes: shift?.notes || undefined,
      };

      const result = await coordinatorService.markAttendance(shiftId, data);

      if (result.isSuccess) {
        // Update local state
        setShifts((prev) => prev.map((s) => (s.shiftId === shiftId ? { ...s, isAttended } : s)));
      } else {
        alert(result.errors?.[0] || "Kunde inte uppdatera närvaro");
      }
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert("Ett oväntat fel uppstod");
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
      } else {
        alert(result.errors?.[0] || "Kunde inte spara anteckningar");
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
      alert("Ett oväntat fel uppstod");
    }
  };

  // Filter shifts
  const filteredShifts = shifts.filter((shift) => {
    // Filter by attendance status
    if (filter === "attended" && !shift.isAttended) return false;
    if (filter === "pending" && shift.isAttended) return false;

    // Filter by volunteer name
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
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

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Sök volontär..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter buttons */}
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
              {dayShifts.map((shift) => (
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

                    {/* Attendance Toggle */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant={shift.isAttended ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleMarkAttendance(shift.shiftId, true)}
                        className={shift.isAttended ? "border-success text-success" : ""}
                      >
                        <Check size={16} className="mr-1" />
                        Närvarande
                      </Button>
                      <Button
                        variant={!shift.isAttended ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleMarkAttendance(shift.shiftId, false)}
                        className={!shift.isAttended ? "border-error text-error" : ""}
                      >
                        <X size={16} className="mr-1" />
                        Frånvarande
                      </Button>
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
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
