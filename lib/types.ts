export interface JobPosting {
  id: number;
  url: string;
  markdown: string;
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
  isPrimary: boolean;
  jobTitle: string;
  companyName: string;
  location: string;
  salaryInfo: string;
  keyTechnologies: string[];
  keySkills: string[];
  culture: string;
}
export interface Assessment extends AssessmentAPIResponse {
  id: number;
}
export interface AssessmentAPIResponse {
  grade: string;
  matchingTech: string[];
  missingTech: string[];
  matchingSkills: string[];
  missingSkills: string[];
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
