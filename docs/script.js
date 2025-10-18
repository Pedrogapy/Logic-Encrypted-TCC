// =================================================================
// 1. IMPORTAÇÕES
// =================================================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { auth, db } from './firebase-init.js';

// =================================================================
// 0. CONFIG
// =================================================================
const MAX_VERSAO = 1; // aumente para 2, 3... quando criar novas pastas versao_2, versao_3 etc.

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
const gameFrame = document.getElementById("game-iframe-container");

// =================================================================
// 3. STATUS FIREBASE
// =================================================================
if (auth && db) {
  statusElement.textContent = "Conectado com Sucesso!";
}

// =================================================================
// 4. CADASTRO / LOGIN / LOGOUT
// =================================================================
botaoCadastrar.addEventListener('click', async () => {
  mensagemErro.textContent = '';
  try {
    const cred = await createUserWithEmailAndPassword(auth, campoEmail.value, campoSenha.value);
    await setDoc(doc(db, "jogadores", cred.user.uid), {
      email: cred.user.email,
      ultimoNivelConcluido: 0
    }, { merge: true });
    campoEmail.value = '';
    campoSenha.value = '';
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      mensagemErro.textContent = 'Erro: Este e-mail já está em uso.';
    } else if (error.code === 'auth/weak-password') {
      mensagemErro.textContent = 'Erro: A senha precisa ter pelo menos 6 caracteres.';
    } else {
      mensagemErro.textContent = 'Ocorreu um erro ao criar a conta.';
    }
  }
});

botaoLogin.addEventListener('click', async () => {
  mensagemLoginErro.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginSenha.value);
  } catch (e) {
    mensagemLoginErro.textContent = 'E-mail ou senha incorretos.';
  }
});

botaoSair.addEventListener('click', async () => {
  await signOut(auth);
  window.location.reload();
});

// =================================================================
// 5. AUTH STATE + CARREGAR JOGO VIA IFRAME
// =================================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    areaNaoLogada.style.display = 'none';
    areaLogada.style.display = 'block';
    emailUsuario.textContent = user.email;

    try {
      const snap = await getDoc(doc(db, "jogadores", user.uid));
      let ultimoNivel = 0;
      if (snap.exists() && typeof snap.data().ultimoNivelConcluido === 'number') {
        ultimoNivel = snap.data().ultimoNivelConcluido;
      }
      const versaoParaCarregar = Math.min(ultimoNivel + 1, MAX_VERSAO);
      const gamePath = `game_versions/versao_${versaoParaCarregar}/index.html`;
      if (gameFrame) gameFrame.src = gamePath;
    } catch (e) {
      console.error("Erro ao buscar progresso:", e);
      if (gameFrame) gameFrame.src = "game_versions/versao_1/index.html";
    }

  } else {
    areaLogada.style.display = 'none';
    areaNaoLogada.style.display = 'block';
    if (gameFrame) gameFrame.src = "";
  }
});

// =================================================================
// 6. SALVAR PROGRESSO VIA HASH (#save_level_X)
// =================================================================
window.addEventListener('hashchange', async () => {
  const hash = window.location.hash;
  if (!hash.startsWith('#save_level_')) return;

  const levelStr = hash.replace('#save_level_', '');
  const nivel = parseInt(levelStr, 10);
  if (isNaN(nivel)) {
    console.error("Hash de salvamento inválido:", hash);
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    await setDoc(doc(db, "jogadores", user.uid), { ultimoNivelConcluido: nivel }, { merge: true });
    window.location.hash = "";
    window.location.reload();
  } catch (e) {
    console.error("Erro ao salvar progresso:", e);
  }
});
