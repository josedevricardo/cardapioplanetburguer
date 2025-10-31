const admin = require("firebase-admin");

// Inicializa Firebase Admin apenas uma vez
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("✅ Firebase Admin inicializado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao inicializar Firebase Admin:", err);
  }
}

const db = admin.database();

export async function handler(event) {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ erro: "Método não permitido" }),
    };
  }

  try {
    const secretEnviado = event.headers["x-firebase-secret"];
    const secretServidor = process.env.FIREBASE_SECRET;

    if (!secretEnviado || secretEnviado !== secretServidor) {
      return {
        statusCode: 403,
        body: JSON.stringify({ erro: "PERMISSION_DENIED: Secret inválido" }),
      };
    }

    const dados = JSON.parse(event.body);

    const numeroPedido =
      dados.numeroPedido || `#${Math.floor(10000 + Math.random() * 90000)}`;

    const novoPedido = {
      ...dados,
      numeroPedido,
      data: new Date().toISOString(),
      status: "pendente",
      informacoes_adicionais: dados.informacoes_adicionais || "",
    };

    await db.ref("pedidos").push(novoPedido);

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true, numeroPedido }),
    };
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: error.message }),
    };
  }
};
