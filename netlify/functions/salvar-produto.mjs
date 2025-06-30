import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método não permitido",
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { id, nome, descricao, preco, foto } = data;

    if (!nome || !descricao || !preco) {
      return {
        statusCode: 400,
        body: JSON.stringify({ erro: "Campos obrigatórios ausentes" }),
      };
    }

    let result;

    if (id) {
      // Atualizar produto existente
      result = await sql`
        UPDATE produtos
        SET nome = ${nome}, descricao = ${descricao}, preco = ${preco}, foto = ${foto}
        WHERE id = ${id}
        RETURNING *;
      `;
    } else {
      // Inserir novo produto
      result = await sql`
        INSERT INTO produtos (nome, descricao, preco, foto)
        VALUES (${nome}, ${descricao}, ${preco}, ${foto})
        RETURNING *;
      `;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: error.message }),
    };
  }
}
