import React, { useState, useEffect, useCallback } from "react";
import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { EmptyState, Spinner } from "@/components/common";
import { BookingCard } from "@/components/features/bookings/BookingCard";
import { Booking, BookingStatus } from "@/types";
import { bookingService } from "@/services";

type FilterTab = "upcoming" | "past";

export const StudentBookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("upcoming");

  // ✅ NEW: Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ FIX: Wrapped in useCallback to satisfy linter
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await bookingService.getMyBookings();

      if (result.isSuccess && result.data) {
        setBookings(result.data);
      } else {
        setError(result.errors?.[0] || "Kunde inte hämta bokningar.");
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Ett oväntat fel uppstod. Försök igen.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filterBookings = (bookings: Booking[], filter: FilterTab): Booking[] => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === "upcoming") {
      return bookings
        .filter((b) => {
          const bookingDate = new Date(b.bookingDate);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= now && b.status === BookingStatus.Confirmed;
        })
        .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
    } else {
      return bookings
        .filter((b) => {
          const bookingDate = new Date(b.bookingDate);
          bookingDate.setHours(0, 0, 0, 0);
          return (
            bookingDate < now ||
            b.status === BookingStatus.Cancelled ||
            b.status === BookingStatus.Attended
          );
        })
        .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    }
  };

  // ✅ NEW: Sets success message and auto-hides it
  const handleCancelSuccess = () => {
    fetchBookings();
    setSuccessMessage("Bokningen har avbokats.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredBookings = filterBookings(bookings, activeFilter);
  const upcomingCount = filterBookings(bookings, "upcoming").length;
  const pastCount = filterBookings(bookings, "past").length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-error font-medium">{error}</p>
            <button
              onClick={fetchBookings}
              className="text-sm text-error underline mt-2 hover:no-underline"
            >
              Försök igen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveFilter("upcoming")}
          className={`tab ${activeFilter === "upcoming" ? "tab-active" : ""}`}
        >
          Kommande {upcomingCount > 0 && `(${upcomingCount})`}
        </button>
        <button
          onClick={() => setActiveFilter("past")}
          className={`tab ${activeFilter === "past" ? "tab-active" : ""}`}
        >
          Tidigare {pastCount > 0 && `(${pastCount})`}
        </button>
      </div>

      {/* ✅ NEW: Success Toast Notification */}
      {successMessage && (
        <div className="mt-4 p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-success font-medium">{successMessage}</p>
        </div>
      )}

      {/* Bookings List */}
      <div className="mt-6">
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={
              activeFilter === "upcoming" ? "Inga kommande bokningar" : "Inga tidigare bokningar"
            }
            description={
              activeFilter === "upcoming"
                ? "Du har inga kommande bokningar. Hitta läxhjälp på platssidan!"
                : "Du har inga tidigare bokningar."
            }
            action={
              activeFilter === "upcoming"
                ? {
                    label: "Boka läxhjälp",
                    onClick: () => (window.location.href = "/venues"),
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancelSuccess={handleCancelSuccess}
                showChildName={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
