// netlify/functions/listarPedidos.js
const { initializeApp, getApps } = require("firebase/app");
const { getDatabase, ref, get } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyAhjSRSbttHjikA3gkm-jgC-jCBCvltR18",
  authDomain: "cardapioplanetsburguer.firebaseapp.com",
  databaseURL: "https://cardapioplanetsburguer-default-rtdb.firebaseio.com",
  projectId: "cardapioplanetsburguer",
  storageBucket: "cardapioplanetsburguer.appspot.com",
  messagingSenderId: "797298710185",
  appId: "1:797298710185:web:e0a2c92ef353ace8fa3bb8",
  measurementId: "G-EP8WK1YFJE"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

exports.handler = async function () {
  try {
    const pedidosRef = ref(db, "pedidos");
    const snapshot = await get(pedidosRef);
    const data = snapshot.exists() ? snapshot.val() : {};
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
