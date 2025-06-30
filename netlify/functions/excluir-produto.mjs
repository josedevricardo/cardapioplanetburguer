import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  const id = event.path.split("/").pop();

  try {
    await sql`DELETE FROM produtos WHERE id = ${id}`;
    return {
      statusCode: 200,
      body: JSON.stringify({ mensagem: "Produto excluído", id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: err.message }),
    };
  }
}
