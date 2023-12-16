import { NextApiRequest, NextApiResponse } from "next";
import { insert } from "@/lib/db";
import { createMarkdown, fetchSPAContent } from "@/lib/parsing";
import { JobPosting } from "@/lib/types";


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

      const markdown = createMarkdown(html);
      if (!markdown) {
        throw new Error("Unable to parse HTML to markdown.");
      }

      const id = await insert<Omit<JobPosting, "id">>("job_postings", {
        url,
        html,
        markdown,
      });

      res.status(200).json({ id, url, html, markdown });
    } catch (error: unknown) {
      const message = (error as Error).message || "Unable to save job posting.";
      res.status(500).json({ message: message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
