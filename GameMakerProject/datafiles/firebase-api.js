// firebase-api.js

// --- Configuração e Inicialização do Firebase ---
// Estas configurações conectam o jogo aos EMULADORES LOCAIS
const firebaseConfig = {
    apiKey: "your-api-key", // Pode ser qualquer valor para emuladores
    authDomain: "localhost",
    projectId: "logic-encrypted-tcc-ae8c2", // O ID do seu projeto
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Conecta aos emuladores locais
auth.useEmulator('http://localhost:9099');
db.useEmulator('http://localhost:8080');


// --- Funções que o GameMaker irá chamar ---

// Função para registrar um novo usuário
function RegisterUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Sucesso
            var user = userCredential.user;
            console.log("Usuário registrado com sucesso:", user.uid);
            
            // Cria um documento de progresso inicial para o novo usuário
            db.collection("users").doc(user.uid).set({
                progress: {
                    fases_desbloqueadas: [true, false, false, false, false, false, false, false, false, false],
                    fases_concluidas: [false, false, false, false, false, false, false, false, false, false],
                    caderno_conceitos: []
                }
            })
            .then(() => {
                // Avisa o GameMaker que o registro foi um sucesso
                GameMaker_AsyncEvent({ "type": "register_success", "uid": user.uid });
            });
        })
        .catch((error) => {
            // Falha
            console.error("Erro no registro:", error.message);
            GameMaker_AsyncEvent({ "type": "register_fail", "message": error.message });
        });
}

// (As funções de Login, Salvar e Carregar virão nos próximos passos)
// =========================================================
// FUNÇÃO PARA O GAMEMAKER "PUXAR" O PROGRESSO DO SITE
// =========================================================

function gms_API_puxarProgressoDoSite() {
    
    // 1. Verifica se o Website/script.js definiu a variável
    if (typeof window.LOGIC_ENCRYPTED_LOAD_PROGRESS !== 'undefined') {
        
        let nivelDoSite = window.LOGIC_ENCRYPTED_LOAD_PROGRESS;
        console.log("firebase-api.js (jogo): Lendo progresso do 'window'. Nível: " + nivelDoSite);

        // 2. Agora, chame a função GML 'scr_gml_set_progress'
        // (que vamos criar no Passo 2)
        if (typeof scr_gml_set_progress === "function") {
            scr_gml_set_progress(nivelDoSite);
        } else {
            console.error("ERRO: A função GML 'scr_gml_set_progress' não foi encontrada.");
        }
        
    } else {
        // Se a variável não existir (rodando o jogo sem o site)
        console.warn("firebase-api.js (jogo): Nenhuma variável de progresso encontrada. Carregando como novo jogador.");
        
        if (typeof scr_gml_set_progress === "function") {
            scr_gml_set_progress(0); // Manda 0 (só a primeira fase liberada)
        }
    }
}