import { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "@/lib/db";

const DB_LOCATION = process.env.DB_LOCATION || "./test.db";
const db = DatabaseService.getInstance(DB_LOCATION);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    
    const { method, query } = req;
    const id = query.id as string;

    switch (method) {
      case "GET":
        if (id === "all") {
          const rows = await db.getAllJobPostings();
          res.status(200).json(rows);
        } else {
          const row = await db.getById("jobs", id);
          if (row) {
            res.status(200).json(row);
          } else {
            res.status(404).json({ error: "Assessment not found" });
          }
        }
        break;
      case "DELETE":
        if (id) {
          await db.deleteById("jobs", id);
          res.status(200).json({ message: "Job posting deleted successfully" });
        } else {
          res.status(400).json({ error: "Missing job posting id" });
        }
        break;
      default:
        res.status(405).json({ error: "Method Not Allowed" });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
