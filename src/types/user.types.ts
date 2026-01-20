import { VolunteerSubject, Venue, VolunteerApplication, VolunteerApplicationStatus } from "@/types";

export enum UserRole {
  Coordinator = 0,
  Volunteer = 1,
  Parent = 2,
  Student = 3,
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
  birthYear: number;
  schoolGrade: string;
  parentId: string;
}

// For adding a child
export interface AddChildRequest {
  firstName: string;
  birthYear: number;
  schoolGrade: string;
}

// For updating a child
export interface UpdateChildRequest {
  firstName: string;
  birthYear: number;
  schoolGrade: string;
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
