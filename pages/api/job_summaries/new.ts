import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { isJobSummary, validateResponse } from "@/lib/serverUtils";
import { systemPrompts } from "@/lib/systemPrompts";
import { OPENAI_KEY, DB_LOCATION } from "@/lib/config";
import DatabaseService from "@/lib/db";

const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

if(!DB_LOCATION) throw Error("DB_LOCATION not set")
const db = DatabaseService.getInstance(DB_LOCATION);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { jobDescription, jobId } = await req.body;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompts["job_summary"],
        },
        {
          role: "user",
          content: `Here is the job description: ${jobDescription}`,
        },
      ],
      stream: false,
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    const data = response["choices"][0].message.content
      ? JSON.parse(response["choices"][0].message.content)
      : null;

    if (validateResponse(data, isJobSummary)) {
      const summary = await db.addSummary(jobId, data);
      res.status(200).json(summary);
    } else {
      res
        .status(500)
        .json({ error: "Generative Model did not output valid JSON" });
    }
  } else {
    res.status(405);
  }
}
