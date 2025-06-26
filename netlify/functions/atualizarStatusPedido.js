import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    const { id, status } = JSON.parse(event.body);

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'ID e status são obrigatórios' }),
      };
    }

    await sql.query(
      `UPDATE pedidos SET status = $1 WHERE id = $2`,
      [status, id]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Status atualizado' }),
    };
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao atualizar status', detalhes: err.message }),
    };
  }
}
