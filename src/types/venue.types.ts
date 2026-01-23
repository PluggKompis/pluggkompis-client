import { VolunteerApplication, Subject } from "@/types";

// Basic venue info for list views (matches VenueDto from backend)
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;

  // Coordinator info
  coordinatorId: string;
  coordinatorName: string;

  // Aggregated data for display
  availableSubjects: Subject[]; // List of subject names
  availableDays: string[]; // List of days (e.g., ["Monday", "Tuesday"])

  // Coordinates for map display
  latitude?: number;
  longitude?: number;

  createdAt?: string;
  updatedAt?: string;
}

// Detailed venue info (matches VenueDetailDto from backend)
export interface VenueDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;

  // Coordinator info
  coordinatorId: string;
  coordinatorName: string;

  // Related data
  timeSlots: TimeSlotSummary[]; // From backend
  volunteers: VolunteerSummary[]; // Active volunteers at this venue

  // Optional: For coordinators viewing their own venue
  pendingApplications?: VolunteerApplication[];

  // Coordinates for map display
  latitude?: number;
  longitude?: number;

  createdAt?: string;
  updatedAt?: string;
}

// Volunteer summary for venue display
export interface VolunteerSummary {
  volunteerId: string;
  volunteerName: string;
  bio?: string;
  experience?: string;
  subjects: Array<{
    subject: {
      id: string;
      name: string;
      icon: string;
    };
    confidenceLevel: "Beginner" | "Intermediate" | "Advanced";
  }>;
}

// TimeSlot details
export interface TimeSlot {
  id: string;
  venueId: string;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  maxStudents: number;
  status: TimeSlotStatus;
  subjects: Subject[]; // Full subject details
  createdAt?: string;
  updatedAt?: string;
  isRecurring: boolean;
  specificDate?: string; // "YYYY-MM-DD"
  recurringStartDate?: string; // "YYYY-MM-DD"
  recurringEndDate?: string; // "YYYY-MM-DD"
}

// TimeSlot summary (lightweight version for venue display)
export interface TimeSlotSummary {
  id: string;
  venueId: string;
  venueName: string;
  dayOfWeek: string;
  startTime: string; // "16:00:00"
  endTime: string; // "18:00:00"
  maxStudents: number;
  availableSpots: number;
  status: string;
  subjects: Subject[];
  currentBookings: number;
  isRecurring: boolean;
  specificDate?: string; // "YYYY-MM-DD"
  recurringStartDate?: string; // "YYYY-MM-DD"
  recurringEndDate?: string; // "YYYY-MM-DD"
}

export enum TimeSlotStatus {
  Open = "Open",
  Full = "Full",
  Cancelled = "Cancelled",
}

// Opening hours
export interface OpeningHours {
  id: string;
  venueId: string;
  dayOfWeek: WeekDay;
  openTime: string; // "16:00:00"
  closeTime: string; // "20:00:00"
}

// WeekDay enum
export enum WeekDay {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

// Swedish labels for display
export const WeekDayLabels: Record<WeekDay, string> = {
  [WeekDay.Sunday]: "Söndag",
  [WeekDay.Monday]: "Måndag",
  [WeekDay.Tuesday]: "Tisdag",
  [WeekDay.Wednesday]: "Onsdag",
  [WeekDay.Thursday]: "Torsdag",
  [WeekDay.Friday]: "Fredag",
  [WeekDay.Saturday]: "Lördag",
};

export const WeekDayToNumber: Record<WeekDay, number> = {
  [WeekDay.Sunday]: 0,
  [WeekDay.Monday]: 1,
  [WeekDay.Tuesday]: 2,
  [WeekDay.Wednesday]: 3,
  [WeekDay.Thursday]: 4,
  [WeekDay.Friday]: 5,
  [WeekDay.Saturday]: 6,
};

// Requests for creating/updating venues
export interface CreateVenueRequest {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateVenueRequest {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

// Filter params for venue search (matches VenueFilterParams from backend)
export interface VenueFilterParams {
  city?: string;
  subjectIds?: string[];
  daysOfWeek?: WeekDay[];
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

// Request for volunteer to apply to a venue
export interface ApplyToVenueRequest {
  venueId: string;
  message?: string; // Optional message from volunteer
}

// Request for creating a new timeslot
export interface CreateTimeSlotRequest {
  venueId: string;
  dayOfWeek: WeekDay;
  startTime: string; // "16:00:00" format
  endTime: string; // "18:00:00" format
  maxStudents: number;
  isRecurring: boolean;
  specificDate?: string; // "2026-02-15" format (only for one-time slots)
  subjectIds: string[]; // Array of subject GUIDs
  recurringStartDate?: string; // Required if isRecurring = true
  recurringEndDate?: string; // Optional
}

// Request for updating a timeslot
export interface UpdateTimeSlotRequest {
  dayOfWeek: WeekDay;
  startTime: string; // "16:00:00" format
  endTime: string; // "18:00:00" format
  maxStudents: number;
  isRecurring: boolean;
  specificDate?: string; // "2026-02-15" format
  subjectIds: string[];
  status: TimeSlotStatus; // Can update status (Open, Full, Cancelled)
  recurringStartDate?: string; // Required if isRecurring = true
  recurringEndDate?: string; // Optional
}
