import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

export const pool = process.env.DB_URL
  ? new Pool({
      connectionString: process.env.DB_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ChatApp',
      password: process.env.DB_PASSWORD || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
    });

export async function initDb() {
  try {
    const schemaPath = path.resolve(process.cwd(), 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
    }
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
}

// Automatically call initDb on module load if connected
initDb().catch((err) => console.error("initDb failed:", err.message));
