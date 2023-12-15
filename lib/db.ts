import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let connection: Database | null = null;
sqlite3.verbose()

const getConnection = async (): Promise<Database> => {
    if (!connection) {
        connection = await open<sqlite3.Database, sqlite3.Statement>({
            filename: './ralph.db',
            driver: sqlite3.Database
        });
    }
    return connection;
};

export { getConnection };
