export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  allergies?: string;
  existingConditions?: string;
  primarySymptom?: string;
}

export interface MedicalCondition {
  name: string;
  probability: number; // 0-100
  reasoning: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendation: string;
}

export interface AssessmentReport {
  summary: string;
  conditions: MedicalCondition[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum AppStage {
  INTAKE = 'INTAKE',
  INTERVIEW = 'INTERVIEW',
  ANALYZING = 'ANALYZING',
  REPORT = 'REPORT',
}
