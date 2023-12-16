import { NextApiRequest, NextApiResponse } from "next";
import TurndownService from "turndown";
import { insert } from "@/lib/db";
import { fetchSPAContent } from "@/lib/serverUtils";
import { JobPosting } from "@/lib/types";
import { cleanMarkdown } from "@/lib/parsing";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { url } = req.body;

    try {
      const html = await fetchSPAContent(url);
      if (!html) {
        throw new Error("Unable to load website.");
      }
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(html);
      if (!markdown) {
        throw new Error("Unable to parse HTML to markdown.");
      }
      const processedMarkdown = cleanMarkdown(markdown);

      //console.log(processedMarkdown)
      const id = await insert<Omit<JobPosting, "id">>("job_postings", {
        url,
        html,
        markdown: processedMarkdown,
      });

      res.status(200).json({ id, url, html, markdown: processedMarkdown });
    } catch (error: unknown) {
      const message = (error as Error).message || "Unable to save job posting.";
      res.status(500).json({ message: message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
