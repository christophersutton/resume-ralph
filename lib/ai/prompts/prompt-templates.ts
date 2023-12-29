import { MessageObject, TaskType } from "../types";

export type TemplateFunction = (...args: string[]) => MessageObject[];

export type PromptTemplates = {
  [version: string]: TemplateFunction;
};

export const PROMPT_TEMPLATES: Record<TaskType, PromptTemplates> = {
  job_summary: {
    "v0.1": (jobDescription: string) => [
      {
        role: "system",
        content: `Resume Matcher Plus is designed to help software engineers quickly assess how well their resume matches a job description. For this task, you will be provided with a markdown-formatted job description and you will summarize that job for the user. You will provide the following details: job title, company name, job location, salary info, a list of the key technologies, a list of the key skills, and a short description of the culture. If you are unable to find any relevant info for any particular field, you will reply N/A for that field. If you can't find any information at all, reply "This is not a job description." Otherwise, return the summary in JSON format: {"jobTitle": jobTitle, "companyName": companyName, "location": location, "salaryInfo": salaryInfo, "keyTechnologies": [keyTechnologies]}, "keySkills": [keySkills], "culture": culture}`,
      },
      {
        role: "user",
        content: `Here is the job description: ${jobDescription}`,
      },
    ],
  },
  assessment: {
    "v0.1": (resumeContents: string, jobDescription: string) => [
      {
        role: "system",
        content: `Resume Matcher Plus is designed to help the user quickly assess how well their resume matches a job description. The user will provide you with a markdown formatted resume and a markdown formatted job description. You will analyze the resume against the job description and provide the user with a letter grade, a list of matching technologies, a list of missing technologies, a list of matching soft skills, and a list of missing soft skills. The result should be in JSON format:
        {"grade": grade, "matchingTech": [matchingTech], "missingTech": [missingTech], "matchingSkills": [matchingSkills], "missingSkills": [missingSkills]}
        `,
      },
      {
        role: "user",
        content: `Please assess my resume for the following job description: ${jobDescription}. Here is my resume: ${resumeContents}`,
      },
    ],
  },
  assessmentFromSummary: {
    "v0.1": (resumeContents: string, jobSummary: string) => [
      {
        role: "system",
        content: `Resume Matcher Plus is designed to help the user quickly assess how well their resume matches a job description. The user will provide you with a markdown formatted resume and a job summary in JSON format. You will analyze the resume against the job summary and provide the user with a letter grade, a list of matching technologies, a list of missing technologies, a list of matching soft skills, and a list of missing soft skills. The result should be in JSON format:
        {"grade": grade, "matchingTech": [matchingTech], "missingTech": [missingTech], "matchingSkills": [matchingSkills], "missingSkills": [missingSkills]}
        `,
      },
      {
        role: "user",
        content: `Please assess my resume for the following job summary: ${JSON.stringify(
          jobSummary
        )}. Here is my resume: ${resumeContents}`,
      },
    ],
  },
};
