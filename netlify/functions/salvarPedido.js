// netlify/functions/salvarPedido.js
const admin = require("firebase-admin");

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL,
} = process.env;

let db;

function initializeFirebase() {
  if (admin.apps.length) return admin.database();

  if (
    !FIREBASE_PROJECT_ID ||
    !FIREBASE_CLIENT_EMAIL ||
    !FIREBASE_PRIVATE_KEY ||
    !FIREBASE_DATABASE_URL
  ) {
    console.error("❌ Variáveis do Firebase ausentes ou incorretas.");
    return null;
  }

  try {
    // Corrige as quebras de linha da chave privada (Netlify remove os \n)
    const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: FIREBASE_PROJECT_ID,
        client_email: FIREBASE_CLIENT_EMAIL,
        private_key: privateKey,
      }),
      databaseURL: FIREBASE_DATABASE_URL,
    });

    console.log("✅ Firebase Admin inicializado com sucesso.");
    return admin.database();
  } catch (e) {
    console.error("❌ Erro ao inicializar Firebase:", e.message);
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

    console.log(`✅ Pedido salvo: ${numeroPedido}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true, numeroPedido }),
    };
  } catch (error) {
    console.error("❌ Erro ao salvar pedido:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        erro: error.message || "Erro interno ao salvar o pedido.",
      }),
    };
  }
};
