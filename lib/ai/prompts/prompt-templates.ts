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
    "v0.2": (jobDescription: string) => [
      {
        role: "system",
        content: `Resume Matcher Plus is designed to help software engineers quickly assess how well their resume matches a job description, and customize their resume for the job. For this task, you will be provided with a markdown-formatted job description and you will summarize that job for the user. You will extract the following information: {jobTitle: the job title, companyName: the name of the company, "location": the job location, "salaryInfo": ideally as a range, "culture": a short blurb on the company culture, "technologies": [a list of all of the technologies mentioned]}, "keyTechSkills": [a list of the key engineering and technology skills], keySoftSkills: [a list of the key soft skills and personal characteristics that the company is looking for]}
        
        ADDITIONAL FIELD DESCRIPTIONS AND EXAMPLES
        The "technologies" list should be specific technologies, programming languages and frameworks. E.g. React or React.js, Node.js, Typescript, Pandas, AWS, DynamoDB, etc. It should not include general terms like "web development" or "cloud computing".
        The "keyTechSkills" list should be broader technical skills that are not specific to a single language etc. Such as micro-services architecture, cloud computing, event-driven architecture, REST Based API design, DevOps, Agile, writing maintainable code, writing engineering specs, evolving legacy codebases, data structures and algorithms, etc.
        The "keySoftSkills" list should be key leadership and personality charactertics they are looking for, such as a good written communicator, able to solve complex problems, team-player, able to present and work with executives and clients, builds for the long term, etc. 

        RULES: 1) You should use exactly the language used in the job description for all of your ouputs. If it says Node.JS you will include Node.JS (and not include just Node or Node.js etc) 2) If you are unable to find any relevant info for any particular field, you will reply N/A for that field. 3) If you can't find any information at all, reply with the statement "This is not a job description. {Description of what you think the document is.}" 4) Otherwise, return the summary in JSON format: {"jobTitle": jobTitle, "companyName": companyName, "location": location, "salaryInfo": salaryInfo, "culture": culture, "technologies": [technologies]}, "keyTechSkills": [keyTechSkills], "keySoftSkills": [keySoftSkills] }
        `,
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
        content: `Resume Matcher Plus is designed to help the user quickly assess how well their resume matches a job description. The user will provide you with a markdown formatted resume and a job summary in JSON format. You will analyze the resume against the job summary and provide the user with a letter grade, a list of matching technologies, a list of missing technologies, a list of matching soft skills, and a list of missing soft skills. The result must be in JSON format:
        {"grade": grade, "matchingTech": [matchingTech], "missingTech": [missingTech], "matchingSkills": [matchingSkills], "missingSkills": [missingSkills]}. Do not return any other text, only the JSON result.
        `,
      },
      {
        role: "user",
        content: `Please assess my resume for the following job summary: ${JSON.stringify(
          jobSummary
        )}. Here is my resume: ${resumeContents}`,
      },
    ],
    "v0.2": (resumeContents: string, jobSummary: string) => [
      {
        role: "system",
        content: `Resume Matcher Plus is designed to help software engineers quickly assess how well their resume matches a job description, and customize their resume for the job. For this task, you will be asked to create the assessment for how well the resume matches the job summary. The user will provide you with a markdown formatted resume and a job summary in JSON format. You will analyze the resume against the job summary and provide the user with the following: {"grade": a letter grade, "matchingTechSkills": [a list of matching tech skills], "missingTechSkills": [a list of missing tech skills], "matchingSoftSkills": [a list of matching soft skills and personal characteristics], "missingSoftSkills": [a list of missing soft skills and personal characteristics]}

        ADDITIONAL FIELD DESCRIPTIONS AND EXAMPLES
        
        The "tech skills" fields should be about broader technical skills that are not specific to a single language etc. Such as micro-services architecture, cloud computing, event-driven architecture, REST Based API design, DevOps, Agile, writing maintainable code, writing engineering specs, evolving legacy codebases, data structures and algorithms, etc.
        The "soft skills" fields should be about key leadership and personality charactertics they are looking for, such as a good written communicator, able to solve complex problems, team-player, able to present and work with executives and clients, builds for the long term, etc. 

        Return the summary in JSON format: {"grade": grade, "matchingTechSkills": [matchingTechSkills], "missingTechSkills": [missingTechSkills], "matchingSoftSkills": [matchingSoftSkills], "missingSoftSkills": [missingSoftSkills]}
        Do not return any other text, only the JSON result.
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
  techListGenerator: {
    "v0.1": (experience, desiredSkillList) => [
      {
        role: "system",
        content: `Resume Ralph helps software engineers quickly assess how well their resume matches a job description, and customize their resume for the job. For this task, you will be asked to create a list of the tech skills that will be mentioned in the resume skills section. The user will provide you with two inputs: their skill list, and the job's desired skill list. 
        
        The goal is to create a list that most closely matches the job's desired list, while filtering for synonyms, maintaining the priority order of the list of the users skills, and removing any skills that are not relevant to the job. It should have a minimum of 7 items, but no maximum for exact skill matchs. If there aren't 7 matches, include the top ranked unmatched skills until you've reached the minimum. The result should be in JSON format: {"techSkills": [techSkills]} and no other text should be returned.

        Examples:
        Synonyms - only one of JavaScript, JS, ES6, and ECMAScript should be included in the result. If one of those is in the job's desired list, it should be included in the result exactly, and no other synonym. If none of them are in the job's desired list, then the one that is in the user's skill list should be included in the result, (depending on the priority order of the user's skill list.)
        `,
      },
      {
        role: "user",
        content: `Please write my list of tech skills for this customized resume. Here is my skill list: ${experience} and here is the job's desired skill list: ${desiredSkillList}`,
      },
    ],
  },
};
