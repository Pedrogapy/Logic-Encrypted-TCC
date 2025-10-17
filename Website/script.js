// =================================================================
// 1. IMPORTAÇÕES
// =================================================================
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { auth, db } from './firebase-init.js';

// =================================================================
// 2. ELEMENTOS DA PÁGINA
// =================================================================
const statusElement = document.getElementById('status-firebase');
const campoEmail = document.getElementById('campo-email');
const campoSenha = document.getElementById('campo-senha');
const botaoCadastrar = document.getElementById('botao-cadastrar');
const mensagemErro = document.getElementById('mensagem-erro');
const loginEmail = document.getElementById('login-email');
const loginSenha = document.getElementById('login-senha');
const botaoLogin = document.getElementById('botao-login');
const mensagemLoginErro = document.getElementById('mensagem-login-erro');
const areaNaoLogada = document.getElementById('area-nao-logada');
const areaLogada = document.getElementById('area-logada');
const emailUsuario = document.getElementById('email-usuario');
const botaoSair = document.getElementById('botao-sair');

// =================================================================
// 3. LÓGICA PRINCIPAL
// =================================================================

if (auth) {
    statusElement.textContent = "Conectado com Sucesso!";
}

botaoCadastrar.addEventListener('click', () => {
    const email = campoEmail.value;
    const senha = campoSenha.value;
    mensagemErro.textContent = '';
    createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            console.log('Usuário criado com sucesso:', userCredential.user);
            campoEmail.value = '';
            campoSenha.value = '';
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                mensagemErro.textContent = 'Erro: Este e-mail já está em uso.';
            } else if (error.code === 'auth/weak-password') {
                mensagemErro.textContent = 'Erro: A senha precisa ter pelo menos 6 caracteres.';
            } else {
                mensagemErro.textContent = 'Ocorreu um erro ao criar a conta.';
            }
        });
});

botaoLogin.addEventListener('click', () => {
    const email = loginEmail.value;
    const senha = loginSenha.value;
    mensagemLoginErro.textContent = '';
    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            console.log('Usuário logado:', userCredential.user.email);
            // O onAuthStateChanged vai cuidar de carregar o jogo
        })
        .catch((error) => {
            mensagemLoginErro.textContent = 'E-mail ou senha incorretos.';
        });
});

botaoSair.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.reload(); // Recarrega a página ao sair
    }).catch((error) => {
        console.error("Erro ao sair:", error);
    });
});

// --- GERENCIADOR DE SESSÃO (O "ROTEADOR" PARA AS 10 VERSÕES) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        areaLogada.style.display = 'block';
        // --- ADICIONAR ESTE BLOCO (LÓGICA DE CARREGAMENTO) ---
console.log("Usuário logado. Verificando progresso no Firebase...");

// Função async para buscar os dados e carregar o jogo
const carregarJogo = async () => {
    try {
        // 1. Pega o documento do usuário no Firestore
        // (Usando "jogadores" como vi no seu script)
        const userDocRef = doc(db, "jogadores", user.uid);
        const userDoc = await getDoc(userDocRef);

        let ultimoNivel = 0; // Nível padrão se for novo
        if (userDoc.exists() && userDoc.data().ultimoNivelConcluido !== undefined) {
            ultimoNivel = userDoc.data().ultimoNivelConcluido;
        }

        // 2. Decide qual versão do jogo carregar (Nível Salvo + 1)
        const versaoParaCarregar = ultimoNivel + 1;
        const gamePath = `game_versions/versao_${versaoParaCarregar}/index.html`;

        console.log(`Progresso atual: ${ultimoNivel}. Carregando: ${gamePath}`);

        // 3. Carrega o jogo no iframe
        // (Estou usando o ID 'game-iframe-container' do seu HTML)
        const gameFrame = document.getElementById("game-iframe-container"); 
        if (gameFrame) {
            gameFrame.src = gamePath;
        } else {
            console.error("ERRO: Não encontrei o iframe 'game-iframe-container' na página.");
        }

    } catch (e) {
        console.error("Erro ao buscar progresso do usuário:", e);
        // Em caso de erro, carrega a versão 1
        const gameFrame = document.getElementById("game-iframe-container");
        if (gameFrame) {
            gameFrame.src = "game_versions/versao_1/index.html";
        }
    }
};

// Chama a função para carregar o jogo
carregarJogo();
// --- FIM DO BLOCO ---
        areaNaoLogada.style.display = 'none';
        emailUsuario.textContent = user.email;

        // Limpa qualquer jogo antigo que possa estar na tela (importante ao recarregar)
        const oldCanvas = document.getElementById('canvas');
        if (oldCanvas) {
            oldCanvas.remove();
        }
        // Remove scripts de jogo antigos
        document.querySelectorAll('script[src*="html5game"]').forEach(script => script.remove());


        // Carrega os dados do Firebase para decidir qual versão do jogo carregar
        const docRef = doc(db, "jogadores", user.uid);
        getDoc(docRef).then((docSnap) => {
        let progresso = 0;
        if (docSnap.exists() && docSnap.data().ultimoNivelConcluido) {
            progresso = docSnap.data().ultimoNivelConcluido;
        }
        progresso = Math.max(0, Math.min(progresso, 9));
        
        console.log(`Progresso do Firebase: ${progresso}. Injetando variável global...`);

        // =========================================================
        // AQUI ESTÁ A MÁGICA!
        // =========================================================

        // 1. Defina uma variável global na "janela" do navegador.
        // Dê um nome único para ela.
        window.LOGIC_ENCRYPTED_LOAD_PROGRESS = progresso;

        // 2. Confirme o nome EXATO do seu arquivo de jogo
        const gameFileName = "Logic Encrypted backup 11 firebase2.js"; 

        // 3. Crie o canvas (como você já faz)
        const gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'canvas';
        document.getElementById('area-logada').appendChild(gameCanvas); 

        // 4. Carregue a UMA ÚNICA VERSÃO do jogo.
        // Crie uma pasta nova (ex: "game_build_unica") e coloque
        // sua compilação HTML5 lá.
        const gameScript = document.createElement('script');
        gameScript.type = 'text/javascript';
        
        // ATENÇÃO: Carregue sempre a MESMA build
        gameScript.src = `game_build_unica/html5game/${gameFileName}`; // <-- Ajuste esse caminho!
        
        document.body.appendChild(gameScript);
    });
         
    } else {
        // Quando o usuário desloga
        areaLogada.style.display = 'none';
        areaNaoLogada.style.display = 'block';
    }
});

// =================================================================
// 4. COMUNICAÇÃO DO GAMEMAKER (Salvar Progresso via URL)
// =================================================================

// O "ouvinte" da URL que já funciona para salvar o progresso
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#save_level_')) {
        const nivelParaSalvar = parseInt(hash.replace('#save_level_', ''));
        if (!isNaN(nivelParaSalvar)) {
            const usuario = auth.currentUser;
            if (usuario) {
                const docRef = doc(db, "jogadores", usuario.uid);
                const dadosParaSalvar = { ultimoNivelConcluido: nivelParaSalvar };
                setDoc(docRef, dadosParaSalvar, { merge: true })
                    .then(() => {
                        console.log("Progresso salvo com sucesso! Recarregando para carregar a nova versão do jogo...");
                        // Força o recarregamento da página para que o GERENCIADOR DE SESSÃO carregue a nova versão do jogo
                        window.location.reload();
                    })
                    .catch((error) => console.error("Erro ao salvar progresso: ", error));
            }
        }
    }
});
// =================================================================
// 4. LÓGICA DE SALVAMENTO (OUVINTE DE HASH)
// =================================================================

window.addEventListener("hashchange", () => {
    const hash = window.location.hash; // Pega o que vem depois do '#' na URL
    console.log("Hash da URL mudou para:", hash);

    // Verifica se o hash começa com o nosso sinal de salvar
    if (hash.startsWith("#save_level_")) {

        // Extrai o número do nível (ex: de "#save_level_1" pega "1")
        const levelCompletedStr = hash.replace("#save_level_", "");
        const levelCompletedInt = parseInt(levelCompletedStr, 10); // Converte para número

        // Verifica se conseguiu converter para número
        if (isNaN(levelCompletedInt)) {
            console.error("Hash de salvamento inválido:", hash);
            return; // Para a execução se o número for inválido
        }

        // Pega o usuário que está logado no momento
        const user = auth.currentUser;

        if (user) {
            console.log(`Sinal recebido: Salvar nível ${levelCompletedInt} para o usuário ${user.uid}`);
            // const db = getFirestore(); // Você já deve ter 'db' importado no topo
            const userDocRef = doc(db, "jogadores", user.uid); // Usa a coleção "jogadores"

            // Função async para salvar no Firebase
            const saveProgress = async () => {
                try {
                    // Atualiza o campo 'ultimoNivelConcluido' no Firestore
                    // O 'merge: true' garante que outros campos não sejam apagados
                    await setDoc(userDocRef, { 
                        ultimoNivelConcluido: levelCompletedInt 
                    }, { merge: true }); 

                    console.log("PROCESSO SALVO NO FIREBASE!");

                    // Opcional, mas RECOMENDADO pela sua arquitetura:
                    // Recarregar a página inteira para forçar o carregamento da próxima versão do jogo
                    console.log("Recarregando a página para carregar a próxima versão...");
                    window.location.reload(); 

                } catch (e) {
                    console.error("Erro ao salvar progresso no Firebase:", e);
                }
            };

            saveProgress(); // Chama a função para salvar

        } else {
            console.warn("Sinal de salvamento recebido, mas nenhum usuário está logado.");
        }

        // Limpa o hash da URL para evitar acionamentos repetidos se algo der errado
        window.location.hash = ""; 
    }
});