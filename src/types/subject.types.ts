export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface SubjectInfo {
  name: string;
  icon?: string;
}

export enum ConfidenceLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface VolunteerSubject {
  subjectId: string;
  subject: Subject;
  confidenceLevel: ConfidenceLevel;
}

export const ConfidenceLevelLabels: Record<ConfidenceLevel, string> = {
  [ConfidenceLevel.Beginner]: "Nybörjare",
  [ConfidenceLevel.Intermediate]: "Mellannivå",
  [ConfidenceLevel.Advanced]: "Avancerad",
};

export interface VolunteerSubject {
  subjectId: string;
  subject: Subject;
  confidenceLevel: ConfidenceLevel;
}