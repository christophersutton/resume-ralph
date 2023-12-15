import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "@/lib/db";
import { convertDBObject } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await getConnection();
    const {
      method,
      query: { id },
    } = req;

    switch (method) {
      case "GET":
        if (id === "all") {
          const rows = await db.all("SELECT * FROM assessments");
          const response = rows.map(convertDBObject).map((row) => ({
            ...row,
            matchingTech: JSON.parse(row.matchingTech),
            missingTech: JSON.parse(row.missingTech),
            matchingSkills: JSON.parse(row.matchingSkills),
            missingSkills: JSON.parse(row.missingSkills),
          }));

          res.status(200).json(response);
        } else {
          const row = await db.get(
            "SELECT * FROM assessments WHERE id = ?",
            id
          );
          if (row) {
            res.status(200).json(convertDBObject(row));
          } else {
            res.status(404).json({ error: "Assessment not found" });
          }
        }
        break;
      case "DELETE":
        if (id) {
          await db.run("DELETE FROM assessments WHERE id = ?", id);
          res.status(200).json({ message: "Assessment deleted successfully" });
        } else {
          res.status(400).json({ error: "Missing assessment id" });
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
