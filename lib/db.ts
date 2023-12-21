import { Assessment, JobPosting } from "@/lib/types";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { convertDBObjectToJS, createSQLParams } from "./serverUtils";
import { Job, JobSummary } from "./types";

type TableName = "jobs" | "summaries" | "assessments";
type TableTypeMapping = {
  jobs: JobPosting;
  summaries: JobSummary;
  assessments: Assessment;
};

let connection: Database | null = null;
sqlite3.verbose();

const getConnection = async (): Promise<Database> => {
  if (!connection) {
    connection = await open<sqlite3.Database, sqlite3.Statement>({
      filename: "./ralph.db",
      driver: sqlite3.Database,
    });
  }
  return connection;
};

const getAll = async <T extends TableName>(
  tablename: T,
  db?: Database
): Promise<TableTypeMapping[T][]> => {
  db = db || (await getConnection());
  return (await db.all(`SELECT * FROM ${tablename}`)).map(
    convertDBObjectToJS
  ) as TableTypeMapping[T][];
};

const getById = async <T extends TableName>(
  tablename: T,
  id: string,
  db?: Database
): Promise<TableTypeMapping[T] | null> => {
  db = db || (await getConnection());
  const result = await db.get(`SELECT * FROM ${tablename} WHERE id = ?`, id);
  return result ? (convertDBObjectToJS(result) as TableTypeMapping[T]) : null;
};

const deleteById = async (tablename: TableName, id: string, db?: Database) => {
  db = db || (await getConnection());
  return await db.run(`DELETE FROM ${tablename} WHERE id = ?`, id);
};

export async function insert<T extends Record<string, any>>(
  table: TableName,
  params: T,
  db?: Database
): Promise<number> {
  try {
    db = db || (await getConnection());
    const { keysString, valuesString, newParams } = createSQLParams(params);
    const sql = `INSERT INTO ${table} 
      (${keysString}) VALUES (${valuesString})`;
    console.log(sql, newParams);
    const result = await db.run(sql, newParams);

    const id = result.lastID;
    if (!id) {
      throw new Error("Unable to insert into table.");
    }
    return id;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to insert into table.");
  }
}
export async function getAllJobPostings(): Promise<Job[]> {
  try {
    const db = await getConnection();

    const [jobPostings, summaries] = await Promise.all([
      getAll("jobs", db),
      getAll("summaries", db),
    ]);

    const resp: Job[] = jobPostings.map((job) => {
      const jobSummaries = summaries.filter((s) => s.jobId === job.id);
      const primarySummary =
        jobSummaries.find((s: JobSummary) => s.isPrimary === true) || null;
      return {
        ...job,
        summaries: jobSummaries,
        primarySummary,
        assessments: [],
        primaryAssessment: null,
      };
    });

    return resp;
  } catch (error) {
    throw new Error("Unable to fetch job postings from the database.");
  }
}

export async function addSummary(
  jobId: number,
  summary: JobSummary,
  db?: Database
): Promise<JobSummary> {
  db = db || (await getConnection());
  try {
    // check if there is a primary summary
    const primarySummary = await db.get(
      `SELECT * FROM summaries WHERE job_id = ? AND is_primary = 1`,
      jobId
    );
    const isPrimary = primarySummary ? false : true;
    const summaryId = await insert<Omit<JobSummary, "id">>("summaries", {
      ...summary,
      isPrimary,
      jobId,
    });
    const newSummary = { ...summary, id: summaryId, jobId, isPrimary };
    return newSummary;
  } catch (error) {
    throw new Error("Unable to add summary to database.");
  }
}

export async function makeSummaryPrimary(
  summaryId: number,
  jobId: number,
  db?: Database
) {
  db = db || (await getConnection());
  try {
    await db.run(
      `UPDATE summaries 
      SET is_primary = CASE WHEN id = ? THEN 1 ELSE 0 END 
      WHERE job_id = ?`,
      [summaryId, jobId]
    );
  } catch (error) {
    throw new Error("Unable to update summary in database.");
  }
}
export { getConnection, getAll, getById, deleteById };
