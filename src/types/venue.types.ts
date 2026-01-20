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

  createdAt?: string;
  updatedAt?: string;
}

// Volunteer summary for venue display
export interface VolunteerSummary {
  volunteerId: string;
  volunteerName: string;
  subjects: string[]; // List of subject names
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
  isRecurring: boolean;
  specificDate?: string;
  currentBookings: number;
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
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export const WeekDayLabels: Record<WeekDay, string> = {
  [WeekDay.Monday]: "Måndag",
  [WeekDay.Tuesday]: "Tisdag",
  [WeekDay.Wednesday]: "Onsdag",
  [WeekDay.Thursday]: "Torsdag",
  [WeekDay.Friday]: "Fredag",
  [WeekDay.Saturday]: "Lördag",
  [WeekDay.Sunday]: "Söndag",
};

export const WeekDayToNumber: Record<WeekDay, number> = {
  [WeekDay.Monday]: 0,
  [WeekDay.Tuesday]: 1,
  [WeekDay.Wednesday]: 2,
  [WeekDay.Thursday]: 3,
  [WeekDay.Friday]: 4,
  [WeekDay.Saturday]: 5,
  [WeekDay.Sunday]: 6,
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
