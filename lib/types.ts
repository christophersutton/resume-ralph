interface Assessment {
  id: number;
  companyName: string | null;
  jobTitle: number | null;
  jobDescription: string | null;
  url: string | null;
  grade: string | null;
  matchingTech: string[];
  missingTech: string[];
  matchingSkills: string[];
  missingSkills: string[];
  rater: string | null;
}

interface ApiResponse {
  grade: string;
  matchingTech: string[];
  missingTech: string[];
  matchingSkills: string[];
  missingSkills: string[];
}
