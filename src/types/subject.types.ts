export interface Subject {
  id: number;
  name: string;
  icon: string; // Emoji icon from backend
}

export enum ConfidenceLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface VolunteerSubject {
  subjectId: number;
  subject: Subject;
  confidenceLevel: ConfidenceLevel;
}