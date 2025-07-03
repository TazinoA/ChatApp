import  {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ChatApp',
  password: `'${process.env.DB_PASSWORD}'`,
  port: process.env.DB_PORT,
});

