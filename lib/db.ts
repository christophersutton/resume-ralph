import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { convertDBObjectToJS, createSQLParams } from "./serverUtils";
import { JobSummary } from "./types";

type TableName = "job_postings" | "assessments" | "job_summaries";

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

const getAll = async (tablename: TableName, db?: Database) => {
  db = db || (await getConnection());
  return (await db.all(`SELECT * FROM ${tablename}`)).map(convertDBObjectToJS);
};

const getById = async (tablename: TableName, id: string, db?: Database) => {
  db = db || (await getConnection());
  return (await db.get(`SELECT * FROM ${tablename} WHERE id = ?`, id)).map(
    convertDBObjectToJS
  );
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

    console.log("inserting: ", sql, newParams);
    const result = await db.run(sql, newParams);
    console.log("result", result);
    const id = result.lastID;
    if (!id) {
      throw new Error("Unable to insert into table.");
    }
    return id;
  } catch (error) {
    throw new Error("Unable to insert into table.");
  }
}
export async function insertFK(
  tableName: TableName,
  fkCol: string,
  fk: number,
  id: number,
  db?: Database
) {
  try {
    db = db || (await getConnection());
    const sql = `UPDATE ${tableName} SET ${fkCol} = ? WHERE id = ?`;
    const result = await db.run(sql, fk, id);
    const returnedId = result.lastID;
    if (!returnedId) {
      throw new Error("Unable to update FK.");
    }
    return returnedId;
  } catch (error) {
    throw new Error("Unable to update FK.");
  }
}
export async function update<T extends Record<string, any>>(
  table: TableName,
  id: string,
  params: T,
  db?: Database
): Promise<void> {
  try {
    db = db || (await getConnection());

    // Transform params to have `$` prefixed keys
    const transformedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [`$${key}`, value])
    );

    const sql = `UPDATE ${table} SET 
      (${Object.keys(params).join(", ")}) 
      VALUES (${Object.keys(transformedParams).join(", ")}) 
      where id = ${id}`;
    console.log(sql);
    await db.run(sql, transformedParams);
  } catch (error) {
    throw new Error("Unable to update row in table.");
  }
}

export async function getAllJobPostings(): Promise<any[]> {
  try {
    const db = await getConnection();

    const [jobPostings, summaries] = await Promise.all([
      getAll("job_postings", db),
      getAll("job_summaries", db),
    ]);
    db.close();

    const resp = jobPostings.map((j) => {
      const { primarySummaryId, ...job } = j;
      job.summaries = summaries.filter((s) => s.id === primarySummaryId);
      job.primarySummary = summaries.find((s) => s.id === primarySummaryId);
      return job;
    });

    return resp;
  } catch (error) {
    throw new Error("Unable to fetch job postings from the database.");
  }
}

export { getConnection, getAll, getById, deleteById };
