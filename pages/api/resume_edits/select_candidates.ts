import { NextApiRequest, NextApiResponse } from "next";
import { DB_LOCATION } from "@/lib/config";
import DatabaseService from "@/lib/db";
import { createLLMService } from "@/lib/ai";

const db = DatabaseService.getInstance(DB_LOCATION);
const llm = createLLMService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      missingSkills,
      experience,
      jobId,
      provider = "openai",
      model = "gpt-4-1106-preview",
    } = await req.body;

    const response = await llm.makeRequest({
      jobId,
      provider,
      model,
      taskType: "generateSuggestions",
      inputData: {
        experience: experience,
        desiredSkillList: missingSkills.join(", "),
      },
    });

    if (response.success && response.completionId) {
      //   const summary = await db.addJobEntity(
      //     jobId,
      //     response.data,
      //     "summaries",
      //     response.completionId
      //   );
      res.status(200).json(response.data);
    } else {
      console.error(response);
      res.status(500).json({
        error: response.error,
      });
    }
  } else {
    res.status(405);
  }
}
