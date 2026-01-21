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
