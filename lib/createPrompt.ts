export default function createPrompt(
  jobDescription: string,
  resumeContents: string
) {
  return [
    {
      role: "system",
      message: `Resume Matcher Plus is designed to help the user quickly assess how well their resume matches a job description. The user will provide you with a markdown formatted resume and the text from a job description. You will analyze the resue against the job description and provide the user with a letter grade, a list of matching technologies, a list of missing technologies, a list of matching soft skills, and a list of missing soft skills. The result should be in JSON format:
        {"Grade": grade, "matchingTechnologies": [matchingTechnologies], "missingTechnologies": [missingTechnologies], "matchingSoftSkills": [matchingSoftSkills], "missingSoftSkills": [missingSoftSkills]}
        `,
    },
    {
      role: "user",
      message: `Here is my resume: 
      ${resumeContents}
      -----
        Here is the job description:
    ${jobDescription} `,
    },
  ];
}
