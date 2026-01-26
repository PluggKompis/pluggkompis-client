import { TimeSlot, WeekDay } from "./venue.types";
// Volunteer Profile DTOs and Request types

// Backend GET response structure (nested subject)
export interface VolunteerProfileDto {
  volunteerId: string; // Note: backend uses volunteerId, not id
  volunteerName: string;
  bio: string;
  experience: string;
  maxHoursPerWeek?: number;
  preferredVenueId?: string | null;
  subjects: VolunteerProfileSubjectDto[];
}

export interface VolunteerProfileSubjectDto {
  subject: {
    id: string;
    name: string;
    icon: string;
  };
  confidenceLevel: "Beginner" | "Intermediate" | "Advanced";
}

// For frontend use (flattened structure)
export interface VolunteerProfileSubjectFlat {
  subjectId: string;
  subjectName: string;
  subjectIcon: string;
  confidenceLevel: "Beginner" | "Intermediate" | "Advanced";
}

export interface CreateVolunteerProfileRequest {
  bio: string;
  experience: string;
  maxHoursPerWeek?: number;
  subjects: Array<{
    subjectId: string;
    confidenceLevel: "Beginner" | "Intermediate" | "Advanced";
  }>;
}

export interface UpdateVolunteerProfileRequest {
  bio: string;
  experience: string;
  maxHoursPerWeek?: number;
  subjects: Array<{
    subjectId: string;
    confidenceLevel: "Beginner" | "Intermediate" | "Advanced";
  }>;
}

// ============================================
// VOLUNTEER APPLICATIONS
// ============================================

// Shared enum for application status (used by both volunteers and coordinators)
export enum ApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Declined = "Declined",
}

// For VOLUNTEER view of their own applications
export interface VolunteerApplication {
  applicationId: string;
  volunteerId: string;
  venueId: string;
  venueName: string;
  venueCity: string;
  venueAddress?: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string; // Coordinator's notes/reason for declining
}

// ============================================
// VOLUNTEER SHIFTS
// ============================================

export enum VolunteerShiftStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Completed = "Completed",
}

export interface VolunteerShift {
  id: string;
  volunteerId: string;
  timeSlotId: string;
  timeSlot?: TimeSlot; // TimeSlot reference
  shiftDate: string;
  status: VolunteerShiftStatus;
  hoursWorked?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerShiftDto {
  id: string;
  timeSlotId: string;
  venueId: string;
  venueName?: string;
  isRecurring: boolean;
  specificDate?: string; // "2026-01-20" format
  dayOfWeek: WeekDay;
  startTime: string; // "16:00:00"
  endTime: string; // "18:00:00"
  status: VolunteerShiftStatus;
  isAttended: boolean;
  notes?: string;
  nextOccurrenceStartUtc?: string; // ISO datetime
  nextOccurrenceEndUtc?: string; // ISO datetime
  durationHours?: number;
}

export interface CreateShiftSignupRequest {
  timeSlotId: string;
  notes?: string;
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

// ============================================
// ATTENDANCE
// ============================================

export interface Attendance {
  id: string;
  bookingId?: string;
  volunteerShiftId?: string;
  attendanceDate: string;
  isPresent: boolean;
  notes?: string;
  markedAt: string;
}

// ============================================
// AVAILABLE SHIFTS
// ============================================
export interface AvailableShiftDto {
  timeSlotId: string;
  venueId: string;
  venueName: string;
  venueAddress?: string;
  venueCity?: string;
  dayOfWeek: WeekDay;
  startTime: string; // "16:00:00"
  endTime: string; // "18:00:00"
  isRecurring: boolean;
  specificDate?: string; // "2026-01-21" (DateOnly from backend)
  subjects: string[];
  volunteersNeeded?: number;
  volunteersSignedUp?: number;
}
