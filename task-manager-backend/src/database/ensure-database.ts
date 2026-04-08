import * as mysql from 'mysql2/promise';

function assertSafeDbName(name: string): string {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error(`Invalid DB_DATABASE (use letters, numbers, underscore only): ${name}`);
  }
  return name;
}

/** Connects without a default schema and creates the database if it does not exist. */
export async function ensureDatabaseExists(): Promise<void> {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = parseInt(process.env.DB_PORT ?? '3306', 10);
  const user = process.env.DB_USERNAME ?? 'root';
  const password =
    process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? '';
  const database = assertSafeDbName(process.env.DB_DATABASE ?? 'task_manager');

  let connection: mysql.Connection;
  try {
    connection = await mysql.createConnection({ host, port, user, password });
  } catch (err: unknown) {
    const e = err as { code?: string; errno?: number; message?: string };
    if (e.code === 'ER_ACCESS_DENIED_ERROR' || e.errno === 1045) {
      throw new Error(
        'MySQL access denied. Ensure task-manager-backend/.env exists (copy .env.example), set DB_PASSWORD to your MySQL user password, and restart. Error: ' +
          (e.message ?? String(err)),
      );
    }
    throw err;
  }
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
}

