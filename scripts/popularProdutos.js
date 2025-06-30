require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const { produtos } = require("../src/produtos.js"); // importa produtos
const sql = neon(process.env.DATABASE_URL);

async function popularBanco() {
  for (const p of produtos) {
    try {
      await sql`
        INSERT INTO produtos (nome, descricao, preco, foto, categoria)
        VALUES (${p.nome}, ${p.descricao}, ${p.preco}, ${p.foto || ""}, ${p.categoria})
        ON CONFLICT (nome) DO NOTHING;
      `;
      console.log(`✅ Inserido: ${p.nome}`);
    } catch (error) {
      console.error(`❌ Erro ao inserir ${p.nome}:`, error.message);
    }
  }

  console.log("✅ Todos os produtos foram inseridos.");
  process.exit(0);
}

popularBanco();
