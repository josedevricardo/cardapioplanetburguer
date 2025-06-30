import { Client } from "@neondatabase/serverless";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Método não permitido" }),
      };
    }

    const { id } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "ID do pedido é obrigatório" }),
      };
    }

    await client.connect();

    const res = await client.query("DELETE FROM pedidos WHERE id = $1 RETURNING *", [id]);

    await client.end();

    if (res.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Pedido não encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Pedido excluído com sucesso", pedido: res.rows[0] }),
    };
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro interno no servidor" }),
    };
  }
}
