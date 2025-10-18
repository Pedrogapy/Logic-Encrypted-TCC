import { LEVELS, renderNotebook } from "./puzzles.js";

const $ = (id) => document.getElementById(id);

// estado local
let currentId = 1;
let maxUnlocked = 0;

// simples “substituição segura” para lacunas: cada “___” vira o token escolhido
function buildUserFunction(src, token){
  const replaced = src.replace(/___/g, token);
  return replaced;
}

// executa sem abrir brecha: criamos uma Function isolada com retorno previsível
function compileAndRun(fnCode, fnName, inputs){
  // bloqueios mínimos (simples) — evita algumas palavras perigosas
  if (/(window|document|fetch|localStorage|eval|Function|import)/.test(fnCode)) {
    throw new Error("Uso de APIs não permitidas no puzzle.");
  }
  // constroi função em sandbox local do escopo
  const wrapped = `${fnCode}; return typeof ${fnName}==='function' ? ${fnName}.apply(null, ${JSON.stringify(inputs)}) : (function(){throw new Error('Função não encontrada: ${fnName}');})();`;
  // cria função sem acesso ao escopo externo
  const f = new Function(wrapped);
  return f();
}

function solutionOutput(level, inputs){
  return level.solution.apply(null, inputs);
}

function renderLevel(level){
  $("puzzle-titulo").textContent = `Fase ${level.id} — ${level.title}`;
  $("puzzle-descricao").textContent = level.description;
  $("editor-codigo").value = level.starter;
  $("saida-teste").textContent = "—";

  // popular seletor de dicas (substituição)
  // (opcional: podemos exibir instruções ao usuário para testar operadores)
}

async function runTests(level){
  const src = $("editor-codigo").value;
  const saida = $("saida-teste");
  saida.textContent = "Executando testes...\n";

  // tentamos cada dica possível para cobrir o placeholder “___”
  const tokens = level.replaceHints && level.replaceHints.length ? level.replaceHints : ["==","!=","<",">","<=",">="];
  let passedAll = false;
  let tokenUsed = null;
  let log = "";

  for (const tok of tokens){
    const code = buildUserFunction(src, tok);
    let ok = true;
    for (const t of level.tests){
      try{
        const outUser = compileAndRun(code, src.match(/function\s+([a-zA-Z0-9_]+)/)[1], t.inp);
        const outRef  = solutionOutput(level, t.inp);
        const pass = JSON.stringify(outUser) === JSON.stringify(outRef);
        log += `Token "${tok}" • Teste ${JSON.stringify(t.inp)} ⇒ seu=${JSON.stringify(outUser)} ref=${JSON.stringify(outRef)} ${pass?"✅":"❌"}\n`;
        if (!pass){ ok = false; break; }
      }catch(e){
        ok = false;
        log += `Token "${tok}" • ERRO: ${e.message}\n`;
        break;
      }
    }
    if (ok){ passedAll = true; tokenUsed = tok; break; }
  }

  saida.textContent = log + (passedAll ? "\n✅ Todos os testes passaram!" : "\n❌ Ainda não está correto.");

  if (passedAll){
    $("btn-proximo").disabled = false;
    await onLevelCompleted(level.id);
  } else {
    $("btn-proximo").disabled = true;
  }
}

async function onLevelCompleted(id){
  const user = window.GameBridge?.user;
  if (!user) return;
  const novo = await window.GameBridge.saveProgress(user.uid, id);
  if (typeof novo === "number"){
    maxUnlocked = Math.max(maxUnlocked, novo);
    document.getElementById("progresso-label").textContent = String(novo);
    renderSelector(); // atualiza grid de fases
  }
}

function renderSelector(){
  const wrap = $("seletor-fases");
  const grid = $("lista-fases");
  if (!wrap || !grid) return;

  wrap.style.display = "block";
  grid.innerHTML = "";
  LEVELS.forEach(lv => {
    const btn = document.createElement("button");
    btn.className = "fase-btn";
    const locked = lv.id > (maxUnlocked + 1);
    if (locked) btn.classList.add("locked");
    btn.innerHTML = `<strong>Fase ${lv.id}</strong><span>${lv.title}</span>`;
    btn.disabled = locked;
    btn.addEventListener("click", () => {
      loadLevel(lv.id);
      window.scrollTo({ top: wrap.offsetTop, behavior: "smooth" });
    });
    grid.appendChild(btn);
  });
}

function loadLevel(id){
  currentId = id;
  const level = LEVELS.find(l => l.id === id);
  if (!level) return;
  $("btn-proximo").disabled = true;
  renderLevel(level);
}

function loadNext(){
  const nxt = currentId + 1;
  if (LEVELS.some(l => l.id === nxt)){
    loadLevel(nxt);
  }
}

// Caderno
function openNotebook(){
  const modal = $("modal-caderno");
  const cont  = $("caderno-conteudo");
  renderNotebook(cont);
  modal.style.display = "flex";
}
function closeNotebook(){
  $("modal-caderno").style.display = "none";
}

// Listeners fixos da UI
window.addEventListener("DOMContentLoaded", () => {
  $("btn-executar")?.addEventListener("click", () => {
    const level = LEVELS.find(l => l.id === currentId);
    if (level) runTests(level);
  });
  $("btn-proximo")?.addEventListener("click", loadNext);
  $("btn-reiniciar")?.addEventListener("click", () => loadLevel(currentId));
  $("btn-caderno")?.addEventListener("click", openNotebook);
  $("btn-fechar-caderno")?.addEventListener("click", closeNotebook);
});

// Integra com Firebase/auth para iniciar na fase certa e bloquear acesso
window.addEventListener("user-ready", (ev) => {
  const prog = Number(ev.detail?.prog || 0);
  maxUnlocked = prog;
  renderSelector();
  const startAt = Math.min(prog + 1, LEVELS.length);
  loadLevel(startAt);
});
