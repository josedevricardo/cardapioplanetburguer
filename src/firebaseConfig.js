import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // ← correto

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,                 // 🔐 vem do Netlify (.env)
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,         // 🔐 idem
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,       // 🔐 idem
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,           // 🔐 idem
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,   // 🔐 idem
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // 🔐 idem
  appId: process.env.REACT_APP_FIREBASE_APP_ID,                   // 🔐 idem
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Exporta para uso no restante do app
export { db, auth };
