import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    const pedidos = await sql('SELECT * FROM pedidos ORDER BY data DESC');
    return {
      statusCode: 200,
      body: JSON.stringify(pedidos),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar pedidos' }),
    };
  }
}
