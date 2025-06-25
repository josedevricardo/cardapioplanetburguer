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

    // Cria a tabela se não existir
    await sql.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        telefone TEXT,
        rua TEXT,
        numero TEXT,
        bairro TEXT,
        pagamento TEXT,
        informacoes_adicionais TEXT,
        itens JSONB,
        total NUMERIC(10,2),
        data TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insere o pedido
    await sql.query(
      `INSERT INTO pedidos (
        nome, telefone, rua, numero, bairro, pagamento, informacoes_adicionais, itens, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        dados.nome || "",
        dados.telefone || "",
        dados.rua || "",
        dados.numero || "",
        dados.bairro || "",
        dados.pagamento || "",
        dados.informacoesAdicionais || "",
        JSON.stringify(dados.itens || []),
        parseFloat(dados.total) || 0.0,
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
