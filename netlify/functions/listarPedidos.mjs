import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    const pedidos = await sql`
      SELECT *,
        to_char(
          (data AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo'),
          'YYYY-MM-DD"T"HH24:MI:SS'
        ) || '-03:00' AS data_brasil
      FROM pedidos
      ORDER BY data DESC
    `;

    const pedidosCorrigidos = pedidos.map(p => ({
      ...p,
      data: p.data_brasil, // substitui o campo data pelo formato ISO com offset
      data_brasil: undefined,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(pedidosCorrigidos),
    };
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar pedidos', detalhes: err.message }),
    };
  }
}
