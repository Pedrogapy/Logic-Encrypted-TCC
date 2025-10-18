// engine.js — modal do terminal, execução dos testes e caderno
import { PUZZLES, NOTEBOOK } from "./puzzles.js";

const $ = (id)=>document.getElementById(id);
const modal = $("modal-puzzle");
const title = $("pz-title");
const desc  = $("pz-desc");
const code  = $("pz-code");
const out   = $("pz-out");

function safeBuild(src, token){
  return src.replace(/___/g, token);
}

function compileAndRun(fnCode, fnName, inputs){
  if (/(window|document|fetch|localStorage|eval|Function|import)/.test(fnCode))
    throw new Error("APIs não permitidas no puzzle.");
  const wrapped = `${fnCode}; return typeof ${fnName}==='function' ? ${fnName}.apply(null, ${JSON.stringify(inputs)}) : (function(){throw new Error('Função não encontrada: ${fnName}');})();`;
  const f = new Function(wrapped);
  return f();
}

function solutionOut(spec, inputs){
  return spec.solution.apply(null, inputs);
}

let currentSpec = null;
let onSolvedCB = null;

function run(){
  if (!currentSpec) return;
  out.textContent = "Executando testes...\n";
  const fnName = (code.value.match(/function\s+([a-zA-Z0-9_]+)/)||[])[1] || "func";

  const tokens = currentSpec.hints?.length ? currentSpec.hints : ["==","!=","<",">","<=",">="];
  let okAll=false, chosen=null, log="";

  for (const tok of tokens){
    const candidate = safeBuild(code.value, tok);
    let pass=true;
    for (const t of currentSpec.tests){
      try{
        const user = compileAndRun(candidate, fnName, t.inp);
        const ref  = solutionOut(currentSpec, t.inp);
        const passOne = JSON.stringify(user)===JSON.stringify(ref);
        log += `Token "${tok}" • ${JSON.stringify(t.inp)} ⇒ seu=${JSON.stringify(user)} ref=${JSON.stringify(ref)} ${passOne?"✅":"❌"}\n`;
        if (!passOne){ pass=false; break; }
      }catch(e){ pass=false; log += `Token "${tok}" • ERRO: ${e.message}\n`; break; }
    }
    if (pass){ okAll=true; chosen=tok; break; }
  }
  out.textContent = log + (okAll? "\n✅ Todos os testes passaram!":"\n❌ Ainda não está correto.");
  if (okAll && typeof onSolvedCB==="function"){ onSolvedCB(true); }
}

$("pz-run")?.addEventListener("click", run);
$("pz-close")?.addEventListener("click", ()=> modal.style.display="none");

// Caderno Virtual
function renderNotebook(keys){
  const cont = $("caderno-conteudo");
  cont.innerHTML = "";
  keys.forEach(k=>{
    const sec = NOTEBOOK[k];
    if (!sec) return;
    const h = document.createElement("h4"); h.textContent = sec.title;
    const p = document.createElement("p");  p.innerHTML = sec.html;
    cont.appendChild(h); cont.appendChild(p);
  });
}
document.getElementById("btn-fechar-caderno")?.addEventListener("click", ()=>{ document.getElementById("modal-caderno").style.display="none"; });

window.PuzzleEngine = {
  open(puzzleId, onSolved){
    const spec = PUZZLES[puzzleId];
    if (!spec){ alert("Terminal sem puzzle configurado."); return; }
    currentSpec = spec; onSolvedCB = onSolved;
    title.textContent = `Terminal — ${spec.title}`;
    desc.textContent  = spec.desc;
    code.value        = spec.starter;
    out.textContent   = "—";
    modal.style.display="flex";
  },
  openNotebook(keys){
    renderNotebook(keys || []);
    document.getElementById("modal-caderno").style.display="flex";
  }
};
