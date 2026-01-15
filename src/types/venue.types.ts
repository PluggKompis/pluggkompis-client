import { Subject } from "./subject.types";

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  maxStudentsPerSession: number;
  recommendedVolunteers: number;
  isActive: boolean;
  subjects: Subject[];
  openingHours: OpeningHours[];
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  id: number;
  venueId: number;
  dayOfWeek: WeekDay;
  openTime: string; // "16:00:00"
  closeTime: string; // "20:00:00"
}

// ✅ Matches backend WeekDay enum
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

// Helper to convert WeekDay to number (0-6) for calendar display
export const WeekDayToNumber: Record<WeekDay, number> = {
  [WeekDay.Monday]: 0,
  [WeekDay.Tuesday]: 1,
  [WeekDay.Wednesday]: 2,
  [WeekDay.Thursday]: 3,
  [WeekDay.Friday]: 4,
  [WeekDay.Saturday]: 5,
  [WeekDay.Sunday]: 6,
};
