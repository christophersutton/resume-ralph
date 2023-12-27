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
      provider: "openai",
      model: "gpt-3.5-turbo-1106",
      taskType: "job_summary",
      inputData: {
        jobDescription,
      },
    });

    if (response.success) {
      const summary = await db.addSummary(jobId, response.data);
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
