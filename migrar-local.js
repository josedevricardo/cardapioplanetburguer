// migrar-local.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push } = require('firebase/database');
const { pedidos } = require('./dados/pedidosNeon.cjs');

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function migrar() {
  const pedidosRef = ref(db, 'pedidos');

  console.log(`Iniciando migração de ${pedidos.length} pedidos...\n`);

  for (let i = 0; i < pedidos.length; i++) {
    try {
      await push(pedidosRef, pedidos[i]);
      console.log(`✔ Pedido ${i + 1} migrado com sucesso.`);
    } catch (erro) {
      console.error(`❌ Erro ao migrar pedido ${i + 1}:`, erro.message);
    }
  }

  console.log('\n✅ Migração finalizada!');
}

migrar().catch(console.error);
