import { UserRole } from "./user.types";
import { TimeSlotStatus, WeekDay } from "./venue.types";
import { BookingStatus } from "./booking.types";

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Error response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Backend OperationResult wrapper
export interface OperationResult<T> {
  isSuccess: boolean;
  data?: T;
  errors?: string[];
  statusCode?: number;
}

// Auth DTOs matching backend exactly
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Backend returns user with string ID and role
export interface AuthUserDto {
  id: string; // Backend returns Guid as string
  email: string;
  role: string; // Backend returns role as string
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUserDto;
}

// Filter/Query params
export interface VenueFilters {
  city?: string;
  subjectId?: number;
  dayOfWeek?: WeekDay;
  isActive?: boolean;
}

export interface BookingFilters {
  studentId?: number;
  childId?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface TimeSlotFilters {
  venueId?: number;
  dayOfWeek?: WeekDay;
  status?: TimeSlotStatus;
  date?: string;
}
