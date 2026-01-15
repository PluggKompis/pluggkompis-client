import { Subject } from './subject.types';
import { WeekDay } from './venue.types';

export interface TimeSlot {
  id: number;
  venueId: number;
  dayOfWeek: WeekDay;
  startTime: string; // "16:00:00"
  endTime: string; // "18:00:00"
  maxStudents: number;
  subjects: Subject[];
  status: TimeSlotStatus;
  createdAt: string;
  updatedAt: string;
}

// ✅ Matches backend: Open, Full, Cancelled
export enum TimeSlotStatus {
  Open = 'Open',
  Full = 'Full',
  Cancelled = 'Cancelled',
}

export interface Booking {
  id: number;
  timeSlotId: number;
  timeSlot?: TimeSlot;
  studentId?: number; // If booked by student directly
  childId?: number; // If booked by parent for child
  bookingDate: string; // "2026-01-20"
  status: BookingStatus;
  selectedSubjects: Subject[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Matches backend: Confirmed, Cancelled, Attended
export enum BookingStatus {
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Attended = 'Attended',
}

export interface VolunteerShift {
  id: number;
  volunteerId: number;
  timeSlotId: number;
  timeSlot?: TimeSlot;
  shiftDate: string; // "2026-01-20"
  status: VolunteerShiftStatus;
  hoursWorked?: number;
  createdAt: string;
  updatedAt: string;
}

// ✅ Matches backend: Pending, Confirmed, Cancelled, Competed (typo in BE)
export enum VolunteerShiftStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Competed = 'Competed', // Note: This matches BE typo (should be "Completed")
}

export interface Attendance {
  id: number;
  bookingId?: number;
  volunteerShiftId?: number;
  attendanceDate: string;
  isPresent: boolean;
  notes?: string;
  markedAt: string;
}