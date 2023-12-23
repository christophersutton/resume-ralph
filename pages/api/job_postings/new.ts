import { NextApiRequest, NextApiResponse } from "next";
import { createMarkdown, fetchSPAContent } from "@/lib/parsing";
import { JobPosting } from "@/lib/types";
import DatabaseService from "@/lib/db";
import { DB_LOCATION } from "@/lib/config";

if (!DB_LOCATION) throw Error("DB_LOCATION not set");
const db = DatabaseService.getInstance(DB_LOCATION);

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

      const id = await db.insert<Omit<JobPosting, "id">>("jobs", {
        url,
        markdown,
      });

      res.status(200).json({ id, url, markdown });
    } catch (error: unknown) {
      const message = (error as Error).message || "Unable to save job posting.";
      res.status(500).json({ message: message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
