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
    const dados = JSON.parse(event.body);

    // Garante que a tabela existe
    await sql(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        telefone TEXT,
        rua TEXT,
        numero TEXT,
        bairro TEXT,
        pagamento TEXT,
        informacoes TEXT,
        itens JSONB,
        total TEXT,
        data TIMESTAMP DEFAULT NOW()
      )
    `);

    // Salva o pedido
    await sql(
      `
      INSERT INTO pedidos (
        nome, telefone, rua, numero, bairro, pagamento, informacoes, itens, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        dados.nome || "",
        dados.telefone || "",
        dados.rua || "",
        dados.numero || "",
        dados.bairro || "",
        dados.pagamento || "",
        dados.informacoesAdicionais || "",
        JSON.stringify(dados.itens || []),
        dados.total || "0.00"
      ]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Pedido salvo com sucesso" }),
    };
  } catch (err) {
    console.error("Erro ao salvar pedido:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao salvar pedido", detalhes: err.message }),
    };
  }
}
