/* game/main.js — robusto contra elementos ausentes no HTML */

/* ========= Helpers ========= */

/** Define texto em um elemento se ele existir (evita TypeError). */
function setTextSafely(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}

/** Pega elemento por ID e retorna null se não existir. */
function byId(id) {
  return document.getElementById(id) || null;
}

/* ========= Save Manager (localStorage) ========= */

const Save = {
  KEY: "le:lastCleared",
  getLastCleared() {
    const raw = localStorage.getItem(this.KEY);
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  },
  setLastCleared(n) {
    localStorage.setItem(this.KEY, String(n));
  },
};

/* ========= Game ========= */

class Game {
  constructor() {
    // canvas & ctx — em sites, podem não existir se o HTML vier diferente
    this.canvas = byId("game-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;

    // estado simples só para exemplo
    this.running = false;
    this.t0 = 0;

    // UI Buttons (se não existirem, apenas não ligamos)
    this.btnRestart = byId("btn-restart");
    this.btnNext = byId("btn-next");
    this.btnLogout = byId("btn-logout");

    // progress
    this.lastCleared = Save.getLastCleared();
  }

  bindUI() {
    if (this.btnRestart) {
      this.btnRestart.addEventListener("click", () => this.restartRoom());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener("click", () => this.nextRoom());
    }
    if (this.btnLogout) {
      this.btnLogout.addEventListener("click", () => this.logout());
    }
  }

  setHUD() {
    // NÃO QUEBRA se o span não estiver no HTML
    setTextSafely("last-cleared", this.lastCleared);
  }

  /* ====== Ciclo de vida ====== */

  load() {
    this.bindUI();
    this.setHUD();

    // Se não há canvas, não iniciamos o loop (e não quebramos)
    if (!this.canvas || !this.ctx) {
      console.warn("[Game] Canvas/Contexto não encontrados. O loop não será iniciado.");
      return;
    }

    this.running = true;
    this.t0 = performance.now();
    requestAnimationFrame(this.loop);
  }

  /** Loop do jogo (bind para manter this). */
  loop = (t) => {
    if (!this.running) return;
    const dt = (t - this.t0) / 1000;
    this.t0 = t;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  };

  update(dt) {
    // Atualizações mínimas (placeholder)
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    // Fundo
    ctx.fillStyle = "#0b111a";
    ctx.fillRect(0, 0, width, height);

    // Apenas um texto de prova de vida
    ctx.fillStyle = "#9aa7bd";
    ctx.font = "16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillText("Jogo carregado. (canvas ativo)", 16, 28);
  }

  /* ====== Ações ====== */

  restartRoom() {
    // Reinicio simples de demonstração
    console.log("[Game] Reiniciar sala");
    // … sua lógica de reiniciar estado de sala
  }

  nextRoom() {
    // Avança progresso (demonstração)
    this.lastCleared = Math.max(this.lastCleared, 1) + 1;
    Save.setLastCleared(this.lastCleared);
    this.setHUD();
    console.log("[Game] Próxima sala. lastCleared =", this.lastCleared);
  }

  logout() {
    // Aqui você coloca seu fluxo real de logout (Firebase, etc.)
    console.log("[Game] Logout clicado.");
    // Exemplo: window.location.href = "login.html";
  }
}

/* ========= Bootstrap ========= */

window.addEventListener("DOMContentLoaded", () => {
  // Se quiser preencher o email do usuário quando disponível:
  setTextSafely("user-email", localStorage.getItem("le:userEmail") || "aluno@exemplo.com");

  const game = new Game();
  game.load();
  // Exponha se quiser debugar: window.game = game;
});
