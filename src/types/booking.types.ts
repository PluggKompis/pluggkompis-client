import { Subject } from "./subject.types";
import { WeekDay, TimeSlotStatus } from "./venue.types";

export interface TimeSlot {
  id: string;
  venueId: string;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  maxStudents: number;
  subjects: Subject[];
  status: TimeSlotStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  timeSlotId: string;
  timeSlot?: TimeSlot;
  studentId?: string;
  childId?: string;
  bookingDate: string;
  status: BookingStatus;
  selectedSubjects: Subject[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
