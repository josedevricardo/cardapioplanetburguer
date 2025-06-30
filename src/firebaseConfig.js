import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAhjSRSbttHjikA3gkm-jgC-jCBCvltR18",
  authDomain: "cardapioplanetsburguer.firebaseapp.com",
  databaseURL: "https://cardapioplanetsburguer-default-rtdb.firebaseio.com",
  projectId: "cardapioplanetsburguer",
  storageBucket: "cardapioplanetsburguer.appspot.com",
  messagingSenderId: "797298710185",
  appId: "1:797298710185:web:e0a2c92ef353ace8fa3bb8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
