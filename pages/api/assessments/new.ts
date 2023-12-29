import { TaskType } from "./../../../lib/ai/types";
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
      jobDescription,
      jobSummary,
      jobId,
      provider = "openai",
      model = "gpt-3.5-turbo-1106",
    } = await req.body;

    const taskType = jobDescription ? "assessment" : "assessmentFromSummary";
    const inputData = jobDescription ? jobDescription : jobSummary;
    const response = await llm.makeRequest({
      jobId,
      provider,
      model,
      taskType,
      inputData,
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
