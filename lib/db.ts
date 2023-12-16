import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { convertDBObject } from "./serverUtils";

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
  return (await db.all(`SELECT * FROM ${tablename}`)).map(convertDBObject);
};

const getById = async (tablename: TableName, id: string, db?: Database) => {
  db = db || (await getConnection());
  return (await db.get(`SELECT * FROM ${tablename} WHERE id = ?`, id)).map(
    convertDBObject
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

    // Transform params to have `$` prefixed keys
    const transformedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [`$${key}`, value])
    );

    const sql = `INSERT INTO ${table} 
      (${Object.keys(params).join(", ")}) 
      VALUES (${Object.keys(transformedParams).join(", ")})`;

    const result = await db.run(sql, transformedParams);
    const id = result.lastID;
    if (!id) {
      throw new Error("Unable to insert into table.");
    }
    return id;
  } catch (error) {
    throw new Error("Unable to insert into table.");
  }
}

export { getConnection, getAll, getById, deleteById };
