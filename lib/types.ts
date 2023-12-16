export interface JobPosting {
  id: number;
  url: string;
  html: string;
  markdown: string;
  primarySummary?: JobSummary;
  summaries?: JobSummary[];
  primaryAssessment?: Assessment;
  assessments?: Assessment[];
}

export interface JobSummary {
  id: number;
  jobId: number;
  title: string;
  company: string;
  location: string;
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
