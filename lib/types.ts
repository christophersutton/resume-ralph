export interface JobPosting {
  id: number;
  url: string;
  markdown: string;
  primarySummary?: JobSummary;
  summaries?: JobSummary[];
  primaryAssessment?: Assessment;
  assessments?: Assessment[];
}

export interface JobSummary {
  id: number;
  jobId: number;
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
