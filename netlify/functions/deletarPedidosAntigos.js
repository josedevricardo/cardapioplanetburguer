import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

const TEMPO_EXPIRACAO_MS = 22 * 60 * 60 * 1000;

export async function handler() {
  try {
    const dataLimite = new Date(Date.now() - TEMPO_EXPIRACAO_MS).toISOString();

    const result = await sql`
      DELETE FROM pedidos
      WHERE data < ${dataLimite}
      RETURNING id
    `;

    // Contar quantos pedidos foram deletados
    const deletados = result.length || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        deletados,
        mensagem: `Pedidos com mais de 22h deletados com sucesso.`
      }),
    };
  } catch (err) {
    console.error("Erro ao deletar pedidos antigos:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao deletar pedidos antigos", detalhes: err.message }),
    };
  }
}
