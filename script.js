import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

const $ = (id) => document.getElementById(id);
const statusEl       = $("status-firebase");
const areaNaoLogada  = $("area-nao-logada");
const areaLogada     = $("area-logada");
const emailUsuario   = $("email-usuario");
const progressoLabel = $("progresso-label");

statusEl.textContent = (auth && db) ? "Conectado com Sucesso!" : "Falha ao iniciar Firebase.";

window.GameBridge = {
  user: null,
  async getProgress(uid){
    try {
      const s = await getDoc(doc(db, "jogadores", uid));
      if (s.exists() && typeof s.data().ultimoNivelConcluido === "number") return s.data().ultimoNivelConcluido;
    } catch(_) {}
    return 0;
  },
  async saveProgress(uid, level){
    try {
      const snap = await getDoc(doc(db, "jogadores", uid));
      let cur = 0; if (snap.exists() && typeof snap.data().ultimoNivelConcluido === "number") cur = snap.data().ultimoNivelConcluido;
      const novo = Math.max(cur, level);
      await setDoc(doc(db, "jogadores", uid), { ultimoNivelConcluido: novo }, { merge: true });
      return novo;
    } catch (e) {
      console.error("Falha ao salvar progresso:", e);
      return null;
    }
  }
};

// criar conta
document.getElementById("botao-cadastrar")?.addEventListener("click", async () => {
  const email = document.getElementById("campo-email").value;
  const senha = document.getElementById("campo-senha").value;
  const msg = document.getElementById("mensagem-erro");
  msg.textContent = "";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, "jogadores", cred.user.uid), { email: cred.user.email, ultimoNivelConcluido: 0 }, { merge: true });
  } catch (e) {
    msg.textContent = e.code || "Erro ao criar conta.";
  }
});

// login
document.getElementById("botao-login")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  const msg = document.getElementById("mensagem-login-erro");
  msg.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch {
    msg.textContent = "E-mail ou senha incorretos.";
  }
});

// sair
document.getElementById("botao-sair")?.addEventListener("click", async () => {
  await signOut(auth); location.reload();
});

// auth → start game
onAuthStateChanged(auth, async (user) => {
  if (user) {
    window.GameBridge.user = user;
    areaNaoLogada.style.display = "none";
    areaLogada.style.display = "block";
    emailUsuario.textContent = user.email;

    const prog = await window.GameBridge.getProgress(user.uid);
    progressoLabel.textContent = String(prog || 0);

    // Inicia jogo quando pronto
    const start = () => window.Game?.start({ startLevel: (prog||0)+1 });
    if (window.Game) start(); else window.addEventListener("game-ready", start, { once:true });

  } else {
    areaLogada.style.display = "none";
    areaNaoLogada.style.display = "block";
  }
});

// HUD botões
document.getElementById("btn-reiniciar")?.addEventListener("click", () => window.Game?.restartLevel());
document.getElementById("btn-proximo")?.addEventListener("click", () => window.Game?.nextLevel());

// Caderno botão (aparece dentro do puzzle também)
document.getElementById("btn-fechar-caderno")?.addEventListener("click", ()=>{ document.getElementById("modal-caderno").style.display="none"; });
