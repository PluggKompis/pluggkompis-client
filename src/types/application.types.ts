export interface VolunteerApplication {
  id: string;
  volunteerId: string;
  venueId: string;
  status: VolunteerApplicationStatus;
  appliedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  message?: string; // Optional message from volunteer
  // Include volunteer info for display
  volunteerName?: string;
  volunteerEmail?: string;
}

export enum VolunteerApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Declined = "Declined",
}

export interface CreateVolunteerApplicationRequest {
  venueId: string;
  message?: string;
}

export interface UpdateVolunteerApplicationRequest {
  status: VolunteerApplicationStatus;
}
