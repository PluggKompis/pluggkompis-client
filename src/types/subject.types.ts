export interface Subject {
  id: string; // Changed from number to string
  name: string;
  icon: string;
}

export enum ConfidenceLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface VolunteerSubject {
  subjectId: string; // Changed from number to string
  subject: Subject;
  confidenceLevel: ConfidenceLevel;
}
