import { OPENAI_API_KEY } from './config';
export interface JobPosting {
  id: number;
  url: string;
  markdown: string;
  createdAt: string;
  updatedAt: string;
}
export interface Job extends JobPosting {
  primarySummary: JobSummary | null;
  summaries: JobSummary[] | [];
  primaryAssessment: Assessment | null;
  assessments: Assessment[] | [];
}
export interface JobSummary {
  id: number;
  jobId: number;
  completionId: number;
  isPrimary: boolean;
  jobTitle: string;
  companyName: string;
  location: string;
  salaryInfo: string;
  technologies: string[];
  keyTechSkills: string[];
  keySoftSkills: string[];
  culture: string;
  updatedAt: string;
  createdAt: string;
}
export interface Assessment extends AssessmentAPIResponse {
  id: number;
  jobId: number;
  isPrimary: boolean;
  completionId: number;
  createdAt: string;
  updatedAt: string;
}
export interface AssessmentAPIResponse {
  grade: string;
  matchingTechSkills: string[];
  missingTechSkills: string[];
  matchingSoftSkills: string[];
  missingSoftSkills: string[];
}


export interface JobSummaryRequest {
  jobDescription: string;
  systemPrompt: string;
  model: string;
}
export interface AssessmentRequest {
  jobDescription: string;
  summary: string;
  resume: string;
}
