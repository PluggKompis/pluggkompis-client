// NOTE: CoordinatorVolunteerApplication is already defined in application.types.ts
// so we don't redefine it here

// Request to approve a volunteer application
export interface ApproveVolunteerRequest {
  decisionNote?: string;
}

// Request to decline a volunteer application (same structure as approve)
export interface DeclineVolunteerRequest {
  decisionNote?: string;
}

// Coordinator's view of volunteer shifts (matches CoordinatorShiftDto from backend)
export interface CoordinatorShift {
  shiftId: string;
  timeSlotId: string;
  venueId: string;
  venueName: string;
  volunteerId: string;
  volunteerName: string;
  occurrenceStartUtc: string;
  occurrenceEndUtc: string;
  status: string;
  isAttended: boolean;
  notes?: string;
}

// Request to mark attendance for a shift
export interface MarkAttendanceRequest {
  isAttended: boolean;
  notes?: string;
}

// Filters for coordinator shifts query
export interface CoordinatorShiftsFilters {
  startUtc?: string;
  endUtcExclusive?: string;
  isAttended?: boolean;
  venueId?: string;
  pageNumber?: number;
  pageSize?: number;
}