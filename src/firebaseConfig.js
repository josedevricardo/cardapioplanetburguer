// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Desestrutura as variáveis de ambiente
const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
} = process.env;

// Verifica se todas as variáveis necessárias estão presentes
if (
  !REACT_APP_FIREBASE_API_KEY ||
  !REACT_APP_FIREBASE_AUTH_DOMAIN ||
  !REACT_APP_FIREBASE_DATABASE_URL ||
  !REACT_APP_FIREBASE_PROJECT_ID
) {
  console.error("❌ Firebase config incompleta. Verifique seu .env.local");
  throw new Error("Firebase config incompleta. Variáveis de ambiente ausentes.");
}

// Configuração do Firebase
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços
export const db = getDatabase(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Logs de confirmação
console.log("✅ Firebase configurado com sucesso");
console.log("DB URL:", REACT_APP_FIREBASE_DATABASE_URL);
