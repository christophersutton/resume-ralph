import OpenAI from "openai";
import { RESUME_CONTENTS } from "@/lib/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "@/lib/db";
import { isValidApiResponse } from "@/lib/serverUtils";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { jobDescription, url, jobTitle, companyName } = await req.body;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Resume Matcher Plus is designed to help the user quickly assess how well their resume matches a job description. The user will provide you with a markdown formatted resume and the text from a job description. You will analyze the resue against the job description and provide the user with a letter grade, a list of matching technologies, a list of missing technologies, a list of matching soft skills, and a list of missing soft skills. The result should be in JSON format:
              {"grade": grade, "matchingTech": [matchingTech], "missingTech": [missingTech], "matchingSkills": [matchingSkills], "missingSkills": [missingSkills]}
              `,
        },
        {
          role: "user",
          content: `Here is my resume:
          ${RESUME_CONTENTS}
          -----
          Here is the job description:
          ${jobDescription} `,
        },
      ],
      stream: false,
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    const data = response["choices"][0].message.content
      ? JSON.parse(response["choices"][0].message.content)
      : null;

    if (isValidApiResponse(data)) {
      const db = await getConnection();
      const sql =
        "INSERT INTO assessments(company_name, url, job_title, job_description, rater, grade, matchingTech, missingTech, matchingSkills, missingSkills) VALUES ($company_name, $url, $job_title, $job_description, $rater, $grade, json($matchingTech), json($missingTech), json($matchingSkills), json($missingSkills))";
      const params = {
        $company_name: companyName,
        $url: url,
        $job_title: jobTitle,
        $job_description: jobDescription,
        $rater: "gpt-3.5-turbo-1106",
        $grade: data.grade,
        $matchingTech: JSON.stringify(data.matchingTech),
        $missingTech: JSON.stringify(data.missingTech),
        $matchingSkills: JSON.stringify(data.matchingSkills),
        $missingSkills: JSON.stringify(data.missingSkills),
      };

      await db.run(sql, params);

      res.status(200).json(data);
    } else {
      res
        .status(500)
        .json({ error: "Generative Model did not output valid JSON" });
    }
  } else {
    res.status(405);
  }
}
