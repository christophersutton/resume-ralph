import { NextApiRequest, NextApiResponse } from "next";
import { deleteById, getAll, getById } from "@/lib/db";
import { convertDBObject } from "@/lib/utils/serverUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const id = query.id as string;

    switch (method) {
      case "GET":
        if (!id) {
          res.status(400).json({ error: "Missing assessment id" });
          return;
        }
        if (id === "all") {
          const rows = await getAll("assessments");
          const response = rows.map((row) => ({
            ...row,
            matchingTech: JSON.parse(row.matchingTech),
            missingTech: JSON.parse(row.missingTech),
            matchingSkills: JSON.parse(row.matchingSkills),
            missingSkills: JSON.parse(row.missingSkills),
          }));

          res.status(200).json(response);
        } else {
          const row = await getById("assessments", id);
          if (row) {
            res.status(200).json(convertDBObject(row));
          } else {
            res.status(404).json({ error: "Assessment not found" });
          }
        }
        break;
      case "DELETE":
        if (id) {
          await deleteById("assessments", id);
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
