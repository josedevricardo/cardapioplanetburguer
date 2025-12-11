import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Verificação de variáveis de ambiente
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.databaseURL ||
  !firebaseConfig.projectId
) {
  console.error(
    "❌ Firebase config incompleta. Variáveis ausentes:",
    Object.keys(firebaseConfig).filter((k) => !firebaseConfig[k])
  );
  throw new Error("Firebase config incompleta. Verifique as variáveis de ambiente.");
}

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta o banco
export const db = getDatabase(app);

// Inicializa Auth
export const auth = getAuth(app);

// 🔥 Persistência garantida (funciona em celular e desktop)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✔️ Persistência Firebase ativada com sucesso.");
  })
  .catch((error) => {
    console.error("❌ Persistência Firebase falhou:", error);
  });

export default app;
