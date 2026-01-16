import { VolunteerSubject, Venue, VolunteerApplication, VolunteerApplicationStatus } from "@/types";

export enum UserRole {
  Coordinator = "Coordinator",
  Volunteer = "Volunteer",
  Parent = "Parent",
  Student = "Student",
}

// Base User with string ID (matches backend Guid)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Parent extends User {
  role: UserRole.Parent;
  children: Child[];
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  gradeLevel?: number;
  parentId: string;
}

export interface Student extends User {
  role: UserRole.Student;
  birthYear?: number;
  gradeLevel?: number;
}

export interface Volunteer extends User {
  role: UserRole.Volunteer;
  bio?: string;
  experience?: string;
  maxHoursPerWeek?: number;
  subjects: VolunteerSubject[];
  // Applications are separate now
  applications?: VolunteerApplication[];
}

// For displaying volunteer's current/active venue
export interface VolunteerWithVenue extends Volunteer {
  currentVenueId?: string;
  currentVenueName?: string;
  currentStatus?: VolunteerApplicationStatus;
}

export interface Coordinator extends User {
  role: UserRole.Coordinator;
  venueId: string;
  venue?: Venue;
}
