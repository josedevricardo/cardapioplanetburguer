import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    // Executa query e obtém resultado
    const pedidos = await sql`SELECT * FROM pedidos ORDER BY data DESC`;

    // Retorna diretamente o resultado (array)
    return {
      statusCode: 200,
      body: JSON.stringify(pedidos), 
    };
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar pedidos', detalhes: err.message }),
    };
  }
}
