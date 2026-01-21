import { TimeSlot, TimeSlotSummary } from "./venue.types";

export interface Booking {
  id: string;
  timeSlotId: string;
  timeSlot?: TimeSlotSummary;
  studentId?: string;
  childId?: string;
  bookedByUserId: string; // matches BE (BookedByUserId)
  bookingDate: string; // Local calendar date
  bookedAt: string; // when booking was created
  status: BookingStatus;
  notes?: string;
  cancelledAt?: string; // when cancelled
  childName?: string; // for display
  venueName?: string; // for display
  venueAddress?: string;
  venueCity?: string;
  timeSlotTime?: string;
}

export interface CreateBookingRequest {
  timeSlotId: string;
  bookingDate: string; // ISO date string
  childId?: string; // Required if parent, null if student
  notes?: string;
}

export interface CancelBookingRequest {
  bookingId: string;
}

export enum BookingStatus {
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Attended = "Attended",
}

export interface VolunteerShift {
  id: string;
  volunteerId: string;
  timeSlotId: string;
  timeSlot?: TimeSlot;
  shiftDate: string;
  status: VolunteerShiftStatus;
  hoursWorked?: number;
  createdAt: string;
  updatedAt: string;
}

export enum VolunteerShiftStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Competed = "Competed", // Matches BE typo
}

export interface Attendance {
  id: string;
  bookingId?: string;
  volunteerShiftId?: string;
  attendanceDate: string;
  isPresent: boolean;
  notes?: string;
  markedAt: string;
}
