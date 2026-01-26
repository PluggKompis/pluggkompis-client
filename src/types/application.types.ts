import { ApplicationStatus } from "./volunteer.types"; // Import shared enum

// For COORDINATOR view of volunteer applications
export interface CoordinatorVolunteerApplication {
  applicationId: string;
  volunteerId: string;
  venueId: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
  message?: string; // Volunteer's application message
  // Volunteer info for coordinator display
  volunteerName?: string;
  volunteerEmail?: string;
}

export interface CreateVolunteerApplicationRequest {
  venueId: string;
  message?: string;
}

export interface UpdateVolunteerApplicationRequest {
  status: ApplicationStatus;
}
