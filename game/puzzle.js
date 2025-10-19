// /game/puzzle.js
// Modal do puzzle. Sem dependências do HTML: é injetado em runtime.

function el(tag, attrs={}, html=""){
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
  if (html) e.innerHTML = html;
  return e;
}

const style = `
#pzl-wrap{position:fixed;inset:0;display:none;place-items:center;background:rgba(0,0,0,.55);z-index:9999;}
#pzl-card{width:min(720px,92vw);background:#0f1420;border:1px solid #1d2436;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.4);overflow:hidden}
#pzl-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #1d2436}
#pzl-head h3{margin:0;font:600 16px ui-sans-serif,system-ui,Segoe UI}
#pzl-body{padding:16px;max-height:62vh;overflow:auto}
#pzl-msg{margin:0 16px 10px 16px;color:#ff7a7a;display:none}
#pzl-foot{display:flex;gap:8px;justify-content:flex-end;padding:14px 16px;border-top:1px solid #1d2436}
.pzl-btn{padding:8px 12px;border-radius:10px;font:600 13px ui-sans-serif;border:1px solid #22304b;background:#121a2b;color:#e6ecff;cursor:pointer}
.pzl-btn.primary{background:#3359ff;border-color:#2b4de6}
.pzl-grid{display:grid;gap:14px}
.pzl-q{background:#0b1020;border:1px solid #1b2238;border-radius:10px;padding:12px}
.pzl-q h4{margin:.2rem 0 .6rem 0;font:600 14px ui-sans-serif}
code{background:#0b1222;border:1px solid #172340;border-radius:8px;padding:10px;display:block;white-space:pre;overflow:auto}
label{display:flex;align-items:center;gap:6px;margin:.25rem 0}
`;

const wrap = el("div",{id:"pzl-wrap"});
const card = el("div",{id:"pzl-card"});
const head = el("div",{id:"pzl-head"}, `<h3>Puzzle</h3><button class="pzl-btn" id="pzl-close">Fechar</button>`);
const msg  = el("div",{id:"pzl-msg"});
const body = el("div",{id:"pzl-body"});
const foot = el("div",{id:"pzl-foot"}, `<button class="pzl-btn" id="pzl-cancel">Cancelar</button><button class="pzl-btn primary" id="pzl-submit">Confirmar</button>`);
card.append(head,msg,body,foot);
wrap.append(card);
document.body.append(wrap, el("style",{},style));

const closeBtn = head.querySelector("#pzl-close");
const cancelBtn= foot.querySelector("#pzl-cancel");
const submitBtn= foot.querySelector("#pzl-submit");

let resolver = null;

function open(){ wrap.style.display="grid"; msg.style.display="none"; }
function close(){ wrap.style.display="none"; body.innerHTML=""; msg.textContent=""; }

closeBtn.onclick = cancelBtn.onclick = ()=>{ resolver?.(false); close(); };

submitBtn.onclick = () => {
  if (!resolver) return;
  const ok = currentCheck?.()===true;
  if (ok){ resolver(true); close(); }
  else { msg.textContent = "Ainda não! Revise a lógica e tente de novo. Dica: consulte o caderno (C)."; msg.style.display="block"; }
};

// ---------- puzzles por fase ----------
let currentCheck = null;

function renderLevel1(){
  body.innerHTML = `
  <div class="pzl-grid">
    <div class="pzl-q">
      <h4>Fase 1 — Condicional (if/else)</h4>
      <p>Considere <code>const temChave = true;</code> Qual <b>condição correta</b> libera a porta?</p>
      <code>// escolha a condição correta para o if
if ( /* ??? */ ) {
  abrirPorta();
} else {
  manterFechada();
}</code>
      <label><input type="radio" name="q1" value="A"> <code>temChave</code></label>
      <label><input type="radio" name="q1" value="B"> <code>temChave = true</code></label>
      <label><input type="radio" name="q1" value="C"> <code>temChave === false</code></label>
      <p style="margin-top:.4rem;">Dica: veja no caderno “Condicionais (if/else)”.</p>
    </div>
  </div>`;
  currentCheck = ()=>{
    const sel = body.querySelector(`input[name="q1"]:checked`);
    return !!sel && sel.value==="A"; // if (temChave)
  };
}

function renderLevel2(){
  // Três números aleatórios.
  const nums = Array.from({length:3},()=>Math.floor(Math.random()*12)+1);
  body.innerHTML = `
  <div class="pzl-grid">
    <div class="pzl-q">
      <h4>Fase 2 — Par/Ímpar com <code>%</code></h4>
      <p>Marque <b>par</b> quando <code>n % 2 === 0</code> e <b>ímpar</b> caso contrário.</p>
      <code>function ehPar(n){ return (n % 2 === 0); }</code>
    </div>
    ${nums.map((n,i)=>`
      <div class="pzl-q">
        <h4>n = ${n}</h4>
        <label><input type="radio" name="r${i}" value="par">Par</label>
        <label><input type="radio" name="r${i}" value="impar">Ímpar</label>
      </div>
    `).join("")}
  </div>`;
  currentCheck = ()=>{
    for (let i=0;i<nums.length;i++){
      const sel = body.querySelector(`input[name="r${i}"]:checked`);
      if (!sel) return false;
      const want = (nums[i]%2===0) ? "par" : "impar";
      if (sel.value!==want) return false;
    }
    return true;
  };
}

export const Puzzle = {
  open(levelId){
    return new Promise(resolve=>{
      resolver = resolve;
      if (levelId===1) renderLevel1();
      else if (levelId===2) renderLevel2();
      else { body.innerHTML = `<p>Sem puzzle definido.</p>`; currentCheck=()=>true; }
      open();
    });
  }
};
