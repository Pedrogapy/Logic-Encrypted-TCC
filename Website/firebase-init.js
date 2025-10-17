// firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
// Vamos adicionar também a importação do serviço de Autenticação
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpBINOCuuqR16gCxckih-JpOhEvifESHk", // Suas chaves aqui
  authDomain: "logic-encrypted-tcc.firebaseapp.com",
  projectId: "logic-encrypted-tcc",
  storageBucket: "logic-encrypted-tcc.appspot.com",
  messagingSenderId: "191903388271",
  appId: "1:191903388271:web:455425dac4acb0d85bfe3a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exporta também a autenticação
export const db = getFirestore(app); // Isso nos dá acesso ao banco de dados