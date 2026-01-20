import { api } from "./api";
import { OperationResult, Booking, CreateBookingRequest, BookingStatus } from "@/types";

class BookingService {
  private baseUrl = "/bookings";

  // Get all bookings for the current user
  async getMyBookings(): Promise<OperationResult<Booking[]>> {
    const response = await api.get<OperationResult<Booking[]>>(this.baseUrl);
    return response.data;
  }

  /**
   * Create a new booking
   * @param timeSlotId - The time slot to book
   * @param bookingDate - The date to book (YYYY-MM-DD or ISO string)
   * @param childId - Child ID if booking for child (parent only)
   * @param notes - Optional notes
   */
  async createBooking(
    timeSlotId: string,
    bookingDate: string,
    childId?: string,
    notes?: string
  ): Promise<OperationResult<Booking>> {
    const request: CreateBookingRequest = {
      timeSlotId,
      bookingDate,
      childId,
      notes,
    };

    const response = await api.post<OperationResult<Booking>>(this.baseUrl, request);

    return response.data;
  }

  /**
   * Cancel a booking
   * @param bookingId - The booking to cancel
   */
  async cancelBooking(bookingId: string): Promise<OperationResult<void>> {
    const response = await api.delete<OperationResult<void>>(`${this.baseUrl}/${bookingId}`);

    return response.data;
  }

  // Filter bookings by status
  filterByStatus(bookings: Booking[], status: BookingStatus): Booking[] {
    return bookings.filter((b) => b.status === status);
  }

  // Check if booking can be cancelled (2-hour window before session start)
  canCancelBooking(booking: Booking, timeSlot: { startTime: string }): boolean {
    const bookingDate = new Date(booking.bookingDate);
    const [hours, minutes] = timeSlot.startTime.split(":").map(Number);

    const sessionStart = new Date(bookingDate);
    sessionStart.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const hoursUntilSession = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilSession >= 2;
  }
}

export const bookingService = new BookingService();
