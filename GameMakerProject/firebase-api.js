// firebase-api.js

// Configuração para conectar aos EMULADORES LOCAIS
const firebaseConfig = {
    apiKey: "qualquer-coisa",
    authDomain: "localhost",
    projectId: "logic-encrypted-tcc-ae8c2", // O ID do seu projeto
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Conecta aos emuladores
auth.useEmulator('http://localhost:9099');
db.useEmulator('http://localhost:8080'); // Use 8081 se você mudou no firebase.json

// Função para GameMaker chamar o registro
function RegisterUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            // Cria o documento de progresso inicial para o novo usuário
            db.collection("users").doc(user.uid).set({
                fases_desbloqueadas: [true, false, false, false, false, false, false, false, false, false],
                fases_concluidas: [false, false, false, false, false, false, false, false, false, false],
                caderno_conceitos: []
            }).then(() => {
                GameMaker_AsyncEvent({ "type": "register_success" });
            });
        })
        .catch((error) => {
            GameMaker_AsyncEvent({ "type": "register_fail", "message": error.message });
        });
}

// Função para GameMaker chamar o login
function LoginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            GameMaker_AsyncEvent({ "type": "login_success", "uid": userCredential.user.uid });
        })
        .catch((error) => {
            GameMaker_AsyncEvent({ "type": "login_fail", "message": error.message });
        });
}
// (As funções de salvar e carregar progresso virão depois)