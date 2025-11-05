// netlify/functions/salvarPedido.js
const admin = require("firebase-admin");

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

const databaseUrl = "https://cardapioplanetsburguer-default-rtdb.firebaseio.com";

let db;

function initializeFirebase() {
  if (admin.apps.length) return admin.database();

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.error("❌ ERRO: Variáveis do Firebase ausentes ou inválidas.");
    return null;
  }

  try {
    // Corrige quebras de linha na chave privada
    const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: FIREBASE_PROJECT_ID,
        client_email: FIREBASE_CLIENT_EMAIL,
        private_key: privateKey,
      }),
      databaseURL: databaseUrl,
    });

    console.log(`✅ Firebase Admin inicializado (${FIREBASE_PROJECT_ID}).`);
    return admin.database();
  } catch (e) {
    console.error("❌ ERRO de inicialização do Firebase:", e.message);
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ erro: "Método não permitido" }),
    };
  }

  db = initializeFirebase();
  if (!db) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Falha ao inicializar Firebase." }),
    };
  }

  try {
    const dados = JSON.parse(event.body);

    const numeroPedido =
      dados.numeroPedido || `#${Math.floor(10000 + Math.random() * 90000)}`;

    const novoPedido = {
      ...dados,
      numeroPedido,
      informacoes_adicionais: dados.informacoes_adicionais || "",
      data: new Date().toISOString(),
      status: "pendente",
    };

    await db.ref("pedidos").push(novoPedido);

    console.log(`✅ Pedido salvo com sucesso: ${numeroPedido}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true, numeroPedido }),
    };
  } catch (error) {
    console.error("❌ Erro ao salvar pedido:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        erro: error.message || "Erro interno ao salvar no banco.",
      }),
    };
  }
};
