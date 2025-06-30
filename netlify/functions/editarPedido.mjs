import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getDatabase();

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    const dados = JSON.parse(event.body);
    const { id, ...atualizacoes } = dados;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID do pedido é obrigatório" }),
      };
    }

    await update(ref(db, `pedidos/${id}`), atualizacoes);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Pedido atualizado com sucesso" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
