import { Vec2, Rect, Input, Timer, moveWithCollisions } from './engine.js';
import { LEVELS } from './levels.js';

const canvas =
  document.getElementById('game') ||
  document.getElementById('game-canvas') ||
  document.getElementById('gameCanvas');

if (!canvas) throw new Error('Canvas do jogo não encontrado. Garanta <canvas id="game"> no HTML.');
const ctx = canvas.getContext('2d');

const input = new Input();
const timer = new Timer();

// DOM (tudo com null-safety)
const elLogout  = document.getElementById('btn-logout')  || null;
const elRestart = document.getElementById('btn-restart') || null;
const elNext    = document.getElementById('btn-next')    || null;
const elSelect  = document.getElementById('btn-level-select') || null;
const elLastCleared = document.getElementById('last-cleared') || null;

const dlgNotebook = document.getElementById('notebook-modal') || null;
const nbBody      = document.getElementById('notebook-content') || null;
const dlgPuzzle   = document.getElementById('puzzle-modal') || null;
const pzBody      = document.getElementById('puzzle-content') || null;
const dlgLevel    = document.getElementById('level-modal') || null;
const lvBody      = document.getElementById('level-content') || null;

dlgNotebook?.querySelector('[data-close-notebook]')?.addEventListener('click', ()=>dlgNotebook.close());
dlgPuzzle?.querySelector('[data-close-puzzle]')?.addEventListener('click', ()=>dlgPuzzle.close());
dlgLevel?.querySelector('[data-close-level]')?.addEventListener('click', ()=>dlgLevel.close());

// Persistência simples
const SAVE_KEY = 'logic_encrypted_progress';
function getSave(){
  try{ return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); }catch{ return {}; }
}
function setSave(obj){ localStorage.setItem(SAVE_KEY, JSON.stringify(obj)); }
function setLastCleared(n){
  const s = getSave(); s.lastCleared = Math.max(s.lastCleared||0, n); setSave(s);
  if (elLastCleared) elLastCleared.textContent = String(s.lastCleared||0);
}
// exibe valor inicial se existir
if (elLastCleared) elLastCleared.textContent = String(getSave().lastCleared || 0);

// Sessão
elLogout?.addEventListener('click', ()=>{ window.location.href = './'; });

// ======== Jogo ========
const state = {
  levelIndex: 0,
  player: {pos:new Vec2(), size:new Vec2(18,18), speed: 140},
  solids: [],
  door: null,
  page: null,
  terminal: null,
  doorOpen: false,
};

function rectFrom(o){ return new Rect(o.x, o.y, o.w, o.h); }

function loadLevel(i){
  state.levelIndex = i;
  const L = LEVELS[i];
  const dpr = window.devicePixelRatio || 1;

  // Ajusta canvas (tamanho real + CSS) — evita blur e getContext nulo
  canvas.width  = Math.floor(L.width  * dpr);
  canvas.height = Math.floor(L.height * dpr);
  canvas.style.width  = L.width + 'px';
  canvas.style.height = L.height + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);

  state.solids = L.walls.map(rectFrom);
  state.door   = rectFrom(L.door);
  state.page   = rectFrom(L.page);
  state.terminal = rectFrom(L.terminal);
  state.player.pos.set(L.spawn.x, L.spawn.y);
  state.player.size.set(L.spawn.w, L.spawn.h);
  state.doorOpen = false;
}

function currentLevel(){ return LEVELS[state.levelIndex]; }

// Helpers
function near(a, b, dist=20){
  const ax = a.x + a.w/2, ay = a.y + a.h/2;
  const bx = b.x + b.w/2, by = b.y + b.h/2;
  const dx = ax-bx, dy = ay-by;
  return (dx*dx + dy*dy) <= (dist*dist);
}

// Notebook (abre só se perto da página)
function openNotebookIfNear(){
  if (!dlgNotebook || !nbBody) return;
  const pRect = new Rect(state.player.pos.x, state.player.pos.y, state.player.size.x, state.player.size.y);
  if (!near(pRect, state.page)) return;
  nbBody.innerHTML = currentLevel().notebook;
  if (!dlgNotebook.open) dlgNotebook.showModal();
}

// Puzzle (abre só se perto do terminal)
function openPuzzleIfNear(){
  if (!dlgPuzzle || !pzBody) return;
  const pRect = new Rect(state.player.pos.x, state.player.pos.y, state.player.size.x, state.player.size.y);
  if (!near(pRect, state.terminal)) return;

  const { puzzle } = currentLevel();
  pzBody.innerHTML = '';

  const prompt = document.createElement('p');
  prompt.textContent = puzzle.prompt;
  pzBody.appendChild(prompt);

  if (puzzle.type === 'input'){
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = puzzle.placeholder || '';
    input.style.marginBottom = '10px';
    pzBody.appendChild(input);

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Enviar';
    pzBody.appendChild(btn);

    const out = document.createElement('p'); out.style.marginTop = '12px';
    pzBody.appendChild(out);

    btn.addEventListener('click', ()=>{
      if (puzzle.check(input.value)){
        out.innerHTML = `<span class="success">${puzzle.success}</span>`;
        state.doorOpen = true;
        setLastCleared(currentLevel().id);
      } else {
        out.innerHTML = `<span class="error">${puzzle.fail}</span>`;
      }
    });
  }
  else if (puzzle.type === 'choices'){
    const wrap = document.createElement('div'); wrap.className = 'radio-row';
    puzzle.options.forEach((opt, idx)=>{
      const lab = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio'; radio.name = 'pzl'; radio.value = idx;
      lab.appendChild(radio); lab.append(opt);
      wrap.appendChild(lab);
    });
    pzBody.appendChild(wrap);

    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Confirmar';
    pzBody.appendChild(btn);

    const out = document.createElement('p'); out.style.marginTop = '12px';
    pzBody.appendChild(out);

    btn.addEventListener('click', ()=>{
      const sel = pzBody.querySelector('input[name="pzl"]:checked');
      const ok  = sel && Number(sel.value) === puzzle.correctIndex;
      if (ok){
        out.innerHTML = `<span class="success">${puzzle.success}</span>`;
        state.doorOpen = true;
        setLastCleared(currentLevel().id);
      } else {
        out.innerHTML = `<span class="error">${puzzle.fail}</span>`;
      }
    });
  }

  if (!dlgPuzzle.open) dlgPuzzle.showModal();
}

// Seleção de níveis (opcional)
function openLevelSelect(){
  if (!dlgLevel || !lvBody) return;
  lvBody.innerHTML = '';
  LEVELS.forEach((L, i)=>{
    const b = document.createElement('button');
    b.className = 'btn btn-secondary';
    b.style.margin = '6px';
    b.textContent = `Sala ${L.id} — ${L.title}`;
    b.addEventListener('click', ()=>{
      loadLevel(i);
      dlgLevel.close();
    });
    lvBody.appendChild(b);
  });
  if (!dlgLevel.open) dlgLevel.showModal();
}
elSelect?.addEventListener('click', openLevelSelect);
elRestart?.addEventListener('click', ()=> loadLevel(state.levelIndex));
elNext?.addEventListener('click', ()=>{
  const next = Math.min(state.levelIndex+1, LEVELS.length-1);
  loadLevel(next);
});

// ======== Loop ========
function step(dt){
  const L = currentLevel();

  // Input / movimento
  let ax=0, ay=0;
  if (input.down('a')) ax -= 1;
  if (input.down('d')) ax += 1;
  if (input.down('w')) ay -= 1;
  if (input.down('s')) ay += 1;
  const len = Math.hypot(ax, ay) || 1;
  const vx = (ax/len) * state.player.speed * dt;
  const vy = (ay/len) * state.player.speed * dt;

  const body = new Rect(state.player.pos.x, state.player.pos.y, state.player.size.x, state.player.size.y);
  const colliders = [...state.solids, ...(state.doorOpen?[]:[state.door])];
  moveWithCollisions(body, vx, 0, colliders);
  moveWithCollisions(body, 0, vy, colliders);
  state.player.pos.set(body.x, body.y);

  // Interações
  if (input.down('c')) openNotebookIfNear();
  if (input.down('e')) openPuzzleIfNear();

  // Render
  draw();
}

function draw(){
  const L = currentLevel();
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // grade sutil
  ctx.save();
  ctx.globalAlpha = .08;
  ctx.fillStyle = '#5b8cff';
  for(let x=0; x<L.width; x+=32){ ctx.fillRect(x,0,1,L.height); }
  for(let y=0; y<L.height; y+=32){ ctx.fillRect(0,y,L.width,1); }
  ctx.restore();

  // Paredes
  ctx.fillStyle = '#2a3650';
  for(const w of state.solids){ ctx.fillRect(w.x, w.y, w.w, w.h); }

  // Porta
  ctx.fillStyle = state.doorOpen ? '#49d17d' : '#7a8fb6';
  ctx.fillRect(state.door.x, state.door.y, state.door.w, state.door.h);

  // Página (azul)
  ctx.fillStyle = '#5b8cff';
  ctx.fillRect(state.page.x, state.page.y, state.page.w, state.page.h);

  // Terminal (amarelo)
  ctx.fillStyle = '#f7c95b';
  ctx.fillRect(state.terminal.x, state.terminal.y, state.terminal.w, state.terminal.h);

  // Jogador (ciano)
  ctx.fillStyle = '#8be9fd';
  ctx.fillRect(state.player.pos.x, state.player.pos.y, state.player.size.x, state.player.size.y);
}

function loop(){
  const dt = timer.tick();
  step(dt);
  requestAnimationFrame(loop);
}

// start
loadLevel(0);
loop();
