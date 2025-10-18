import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

const MAX_VERSAO = 1;

const statusEl = document.getElementById("status-firebase");
const campoEmail = document.getElementById("campo-email");
const campoSenha = document.getElementById("campo-senha");
const botaoCadastrar = document.getElementById("botao-cadastrar");
const msgErro = document.getElementById("mensagem-erro");
const loginEmail = document.getElementById("login-email");
const loginSenha = document.getElementById("login-senha");
const botaoLogin = document.getElementById("botao-login");
const msgLoginErro = document.getElementById("mensagem-login-erro");
const areaNaoLogada = document.getElementById("area-nao-logada");
const areaLogada = document.getElementById("area-logada");
const emailUsuario = document.getElementById("email-usuario");
const botaoSair = document.getElementById("botao-sair");
const gameFrame = document.getElementById("game-iframe-container");

if (auth && db) statusEl.textContent = "Conectado com Sucesso!";

botaoCadastrar.addEventListener("click", async () => {
  msgErro.textContent = "";
  try {
    const cred = await createUserWithEmailAndPassword(auth, campoEmail.value, campoSenha.value);
    await setDoc(doc(db, "jogadores", cred.user.uid), {
      email: cred.user.email,
      ultimoNivelConcluido: 0
    }, { merge: true });
    campoEmail.value = "";
    campoSenha.value = "";
  } catch (e) {
    if (e.code === "auth/email-already-in-use") msgErro.textContent = "E-mail já em uso.";
    else if (e.code === "auth/weak-password") msgErro.textContent = "Senha precisa de 6+ caracteres.";
    else msgErro.textContent = "Erro ao criar conta.";
  }
});

botaoLogin.addEventListener("click", async () => {
  msgLoginErro.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginSenha.value);
  } catch {
    msgLoginErro.textContent = "E-mail ou senha incorretos.";
  }
});

botaoSair.addEventListener("click", async () => {
  await signOut(auth);
  window.location.reload();
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    areaNaoLogada.style.display = "none";
    areaLogada.style.display = "block";
    emailUsuario.textContent = user.email;

    try {
      const snap = await getDoc(doc(db, "jogadores", user.uid));
      let ultimo = 0;
      if (snap.exists() && typeof snap.data().ultimoNivelConcluido === "number") {
        ultimo = snap.data().ultimoNivelConcluido;
      }
      const versao = Math.min(ultimo + 1, MAX_VERSAO);
      const gamePath = `game_versions/versao_${versao}/index.html`;
      gameFrame.src = gamePath;
    } catch (e) {
      console.error("Erro ao buscar progresso:", e);
      gameFrame.src = "game_versions/versao_1/index.html";
    }
  } else {
    areaLogada.style.display = "none";
    areaNaoLogada.style.display = "block";
    gameFrame.src = "";
  }
});

// recebe progresso do jogo (#save_level_X)
window.addEventListener("hashchange", async () => {
  const h = window.location.hash;
  if (!h.startsWith("#save_level_")) return;
  const nivel = parseInt(h.replace("#save_level_", ""), 10);
  if (Number.isNaN(nivel)) return;

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
