import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Loads from .env locally

const isProduction = process.env.NODE_ENV === 'production';

export const pool = isProduction
  ? new Pool({
      connectionString: process.env.DB_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: 'ChatApp',
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });
