// =================================================================
// 1. IMPORTAÇÕES
// =================================================================
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
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