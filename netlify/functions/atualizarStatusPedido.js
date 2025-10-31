// netlify/functions/atualizarStatusPedido.js

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

exports.handler = async (event) => {
  try {
    const { pedidoId, novoStatus } = JSON.parse(event.body);

    if (!pedidoId || !novoStatus) {
      return { statusCode: 400, body: JSON.stringify({ error: "Dados inválidos" }) };
    }

    await db.ref(`pedidos/${pedidoId}`).update({ status: novoStatus });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Status atualizado com sucesso" }),
    };
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Erro interno" }) };
  }
};
