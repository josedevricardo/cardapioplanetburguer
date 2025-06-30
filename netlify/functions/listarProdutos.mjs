import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    const produtos = await sql`SELECT * FROM produtos ORDER BY id ASC`;
    return {
      statusCode: 200,
      body: JSON.stringify(produtos),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: err.message }),
    };
  }
}
