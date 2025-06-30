const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyAhjSRSbttHjikA3gkm-jgC-jCBCvltR18",
  authDomain: "cardapioplanetsburguer.firebaseapp.com",
  databaseURL: "https://cardapioplanetsburguer-default-rtdb.firebaseio.com",
  projectId: "cardapioplanetsburguer",
  storageBucket: "cardapioplanetsburguer.appspot.com",
  messagingSenderId: "797298710185",
  appId: "1:797298710185:web:e0a2c92ef353ace8fa3bb8",
  measurementId: "G-EP8WK1YFJE",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ erro: "Método não permitido" }),
    };
  }

  try {
    const dados = JSON.parse(event.body);

    // Garante que o número do pedido seja string válida
    const numeroPedido = dados.numeroPedido || `#${Math.floor(10000 + Math.random() * 90000)}`;

    const novoPedido = {
      ...dados,
      numeroPedido: numeroPedido, // nunca será undefined
      informacoes_adicionais: dados.informacoes_adicionais || "", // evita undefined
      data: new Date().toISOString(),
      status: "pendente",
    };

    const pedidosRef = ref(db, "pedidos");
    await push(pedidosRef, novoPedido);

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
