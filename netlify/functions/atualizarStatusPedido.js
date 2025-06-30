// netlify/functions/atualizarStatusPedido.js

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, update } = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função continua normalmente, mas sem CSS importado.
