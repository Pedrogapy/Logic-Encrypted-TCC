import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

/**
 * Como o jogo não recebe mensagens externas, a progressão é por versões.
 * Ao fazer login, buscamos "ultimoNivelConcluido" no Firestore e carregamos
 * a versão correspondente (nivel+1), limitado a MAX_VERSAO.
 */
const MAX_VERSAO = 10;

const $ = (id) => document.getElementById(id);
const statusEl       = $("status-firebase");
const campoEmail     = $("campo-email");
const campoSenha     = $("campo-senha");
const botaoCadastrar = $("botao-cadastrar");
const msgErro        = $("mensagem-erro");
const loginEmail     = $("login-email");
const loginSenha     = $("login-senha");
const botaoLogin     = $("botao-login");
const msgLoginErro   = $("mensagem-login-erro");
const areaNaoLogada  = $("area-nao-logada");
const areaLogada     = $("area-logada");
const emailUsuario   = $("email-usuario");
const botaoSair      = $("botao-sair");
const gameFrame      = $("game-iframe-container");

statusEl.textContent = (auth && db) ? "Conectado com Sucesso!" : "Falhou a conexão.";

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
    areaLogada.style.display    = "block";
    emailUsuario.textContent    = user.email;

    try {
      const snap = await getDoc(doc(db, "jogadores", user.uid));
      let ultimo = 0;
      if (snap.exists() && typeof snap.data().ultimoNivelConcluido === "number") {
        ultimo = snap.data().ultimoNivelConcluido;
      }
      const versao = Math.max(1, Math.min(ultimo + 1, MAX_VERSAO));
      gameFrame.src = `game_versions/versao_${versao}/index.html`;
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

/**
 * Quando o jogo (que não recebe mensagens) conclui uma versão,
 * nós atualizamos manualmente o Firestore via hash: #save_level_X
 * (isso é emitido pelo stub dentro do index da versão).
 */
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
