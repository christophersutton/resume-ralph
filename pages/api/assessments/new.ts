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
    const { jobDescription, jobId } = await req.body;
    const response = await llm.makeRequest({
      jobId: jobId,
      provider: "openai",
      model: "gpt-3.5-turbo-1106",
      taskType: "assessment",
      inputData: {
        jobDescription,
      },
    });
    if (response.success && response.completionId) {
      const summary = await db.addJobEntity(
        jobId,
        response.data,
        "assessments",
        response.completionId
      );
      res.status(200).json(summary);
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
