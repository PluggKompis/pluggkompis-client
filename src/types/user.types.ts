import { Venue } from "./venue.types";
import { VolunteerSubject } from "./subject.types";

export enum UserRole {
  Coordinator = "Coordinator",
  Volunteer = "Volunteer",
  Parent = "Parent",
  Student = "Student",
}

export interface User {
  id: number;
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
  id: number;
  firstName: string;
  lastName: string;
  birthYear: number;
  gradeLevel?: number;
  parentId: number;
}

export interface Student extends User {
  role: UserRole.Student;
  birthYear?: number;
  gradeLevel?: number;
}

export interface Volunteer extends User {
  role: UserRole.Volunteer;
  venueId: number;
  venue?: Venue;
  bio?: string;
  experience?: string;
  maxHoursPerWeek?: number;
  status: VolunteerApplicationStatus;
  approvedAt?: string;
  subjects: VolunteerSubject[];
}

export enum VolunteerApplicationStatus {
  Pending = 1,
  Approved = 2,
  Declined = 3,
}

export interface Coordinator extends User {
  role: UserRole.Coordinator;
  venueId: number;
  venue?: Venue;
}
