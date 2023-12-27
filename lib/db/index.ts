import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import {
  camelToSnake,
  convertDBObjectToJS,
  createSQLParams,
} from "../utils/serverUtils";
import { Assessment, Job, JobPosting, JobSummary } from "@/lib/types";
import { Completion } from "../ai/types";

type TableName = "jobs" | "summaries" | "assessments" | "completions";
type TableTypeMapping = {
  jobs: JobPosting;
  summaries: JobSummary;
  assessments: Assessment;
  completions: Completion;
};

class DatabaseService {
  private static instance: DatabaseService;
  private connection: Database | null = null;

  // Make the constructor private to prevent direct construction calls
  private constructor(private filename: string) {
    sqlite3.verbose();
  }

  // The getInstance method provides a way to access the singleton instance
  public static getInstance(filename: string): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(filename);
    }
    return DatabaseService.instance;
  }

  private async getConnection(): Promise<Database> {
    if (!this.connection) {
      this.connection = await open<sqlite3.Database, sqlite3.Statement>({
        filename: this.filename,
        driver: sqlite3.Database,
      });
    }
    return this.connection;
  }

  public async getAll<T extends TableName>(
    tablename: T
  ): Promise<TableTypeMapping[T][]> {
    const db = await this.getConnection();
    return (await db.all(`SELECT * FROM ${tablename}`)).map(
      convertDBObjectToJS
    ) as TableTypeMapping[T][];
  }

  public async getById<T extends TableName>(
    tablename: T,
    id: string
  ): Promise<TableTypeMapping[T] | null> {
    const db = await this.getConnection();
    const result = await db.get(`SELECT * FROM ${tablename} WHERE id = ?`, id);
    return result ? (convertDBObjectToJS(result) as TableTypeMapping[T]) : null;
  }

  public async deleteById(tablename: TableName, id: string): Promise<void> {
    const db = await this.getConnection();
    await db.run(`DELETE FROM ${tablename} WHERE id = ?`, id);
  }

  public async insert<T extends Record<string, any>>(
    table: TableName,
    params: T
  ): Promise<number> {
    const db = await this.getConnection();
    try {
      const { keysString, valuesString, newParams } = createSQLParams(params);
      const sql = `INSERT INTO ${table} (${keysString}) VALUES (${valuesString})`;
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
  public async update<
    T extends TableName,
    U extends Partial<TableTypeMapping[T]>
  >(tableName: T, id: number, updateFields: U): Promise<void> {
    const db = await this.getConnection();
    try {
      // Modify updateFields to JSON stringify objects and arrays
      const processedUpdateFields = Object.entries(updateFields).reduce(
        (acc, [key, value]) => {
          const k = camelToSnake(key) as keyof U;
          acc[k] =
            (typeof value === "object" || Array.isArray(value)) &&
            value !== null
              ? JSON.stringify(value)
              : value;
          return acc;
        },
        {} as U
      );

      // Create the SET part of the SQL query
      const setString =
        Object.keys(processedUpdateFields)
          .map((key) => `${key} = ?`)
          .join(", ") + ", updated_at = datetime('now')";
      const setValues = Object.values(processedUpdateFields);

      // SQL statement to update by id
      const sql = `UPDATE ${tableName} SET ${setString} WHERE id = ?`;
      await db.run(sql, [...setValues, id]);
    } catch (error) {
      console.error("Error updating record:", error);
      throw new Error("Unable to update record in the database.");
    }
  }

  public async getAllJobPostings(): Promise<Job[]> {
    try {
      const [jobPostings, summaries, assessments] = await Promise.all([
        this.getAll("jobs"),
        this.getAll("summaries"),
        this.getAll("assessments"),
      ]);

      const resp: Job[] = jobPostings.map((job) => {
        const jobSummaries = summaries.filter((s) => s.jobId === job.id);
        const jobAssessments = assessments.filter((a) => a.jobId === job.id);
        const primarySummary =
          jobSummaries.find((s: JobSummary) => s.isPrimary === true) || null;
        const primaryAssessment =
          jobAssessments.find((a: Assessment) => a.isPrimary === true) || null;
        return {
          ...job,
          summaries: jobSummaries,
          primarySummary,
          assessments: jobAssessments,
          primaryAssessment: primaryAssessment,
        };
      });

      return resp;
    } catch (error) {
      throw new Error("Unable to fetch job postings from the database.");
    }
  }

  public async addSummary(
    jobId: number,
    summary: JobSummary
  ): Promise<JobSummary> {
    const db = await this.getConnection();
    try {
      // check if there is a primary summary
      const primarySummary = await db.get(
        `SELECT * FROM summaries WHERE job_id = ? AND is_primary = 1`,
        jobId
      );
      const isPrimary = primarySummary ? false : true;
      const summaryId = await this.insert<Omit<JobSummary, "id">>("summaries", {
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

  public async addAssessment(
    jobId: number,
    assessment: Assessment,
    completionId: number
  ): Promise<Assessment> {
    const db = await this.getConnection();
    try {
      // check if there is a primary summary
      const primaryAssessment = await db.get(
        `SELECT * FROM assessments WHERE job_id = ? AND is_primary = 1`,
        jobId
      );
      const isPrimary = primaryAssessment ? false : true;
      const assessmentId = await this.insert<Omit<Assessment, "id">>(
        "assessments",
        {
          ...assessment,
          completionId,
          isPrimary,
          jobId,
        }
      );
      const newSummary = { ...assessment, id: assessmentId, jobId, isPrimary };
      return newSummary;
    } catch (error) {
      throw new Error("Unable to add summary to database.");
    }
  }
  public async addJobEntity<T extends JobSummary | Assessment>(
    jobId: number,
    entity: T,
    tableName: "summaries" | "assessments",
    completionId: number
  ): Promise<T> {
    const db = await this.getConnection();
    try {
      // Check if there is a primary entity
      const primaryEntity = await db.get(
        `SELECT * FROM ${tableName} WHERE job_id = ? AND is_primary = 1`,
        jobId
      );
      const isPrimary = primaryEntity ? false : true;
      const entityId = await this.insert<Omit<T, "id">>(tableName, {
        ...entity,
        completionId,
        isPrimary,
        jobId,
      });
      const newEntity = {
        ...entity,
        id: entityId,
        completionId,
        jobId,
        isPrimary,
      };
      return newEntity;
    } catch (error) {
      throw new Error(`Unable to add entity to ${tableName} in database.`);
    }
  }

  public async makeSummaryPrimary(summaryId: number, jobId: number) {
    const db = await this.getConnection();
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
}

export default DatabaseService;
