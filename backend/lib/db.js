import path from 'path';
import dotenv from 'dotenv';
import  {Pool} from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const dbUser = process.env.DB_USER;

export const pool = new Pool({
  user: dbUser,
  host: host,
  database: 'ChatApp',
  password: password,
  port: port,
});
