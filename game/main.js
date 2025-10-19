// /game/main.js
import {LEVELS, buildLevel} from "./levels.js";
import {Notebook} from "./notebook.js";
import {Input} from "./core.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hudEl = document.getElementById("hud");

class Game {
  constructor(){
    this.entities=[]; this.player=null; this.world=null;
    this.notes=new Set(); this.canUse=false;
    this._lastHudT=0;
  }
  setHUD(text){
    hudEl.textContent = text || "";
    hudEl.classList.add("on");
    this._lastHudT = performance.now();
  }
  unlockDoor(){ const d = this.entities.find(e=>e instanceof Object && e.draw && e.solid!==undefined); if(this.world?.door) this.world.door.open=true; }
  collectNote(key){ this.notes.add(key); Notebook.addNote(key); } // NÃO abre o modal
  load(id){
    const def = LEVELS.find(l=>l.id===id) || LEVELS[0];
    this.world = buildLevel(def);
    this.entities = this.world.entities;
    this.player   = this.world.player;
    Notebook.setNotes(this.notes);  // mantém o que já tem
    this.setHUD("Explore. Abrir caderno: C. Interagir com terminal: E.");
  }
  tryInteract(){
    const t = this.entities.find(e=>e.w===22 && e.h===22); // nosso terminal
    if (!t) return;
    const pb=this.player.bbox, tb=t.bbox;
    const near = !(pb.x+pb.w<tb.x-4 || pb.x>tb.x+tb.w+4 || pb.y+pb.h<tb.y-4 || pb.y>tb.y+tb.h+4);
    if (near) t.use(this);
  }
  update(){
    // checa "uso" disponível
    const t = this.entities.find(e=>e.w===22 && e.h===22);
    this.canUse = false;
    if(t){
      const pb=this.player.bbox, tb=t.bbox;
      this.canUse = !(pb.x+pb.w<tb.x-4 || pb.x>tb.x+tb.w+4 || pb.y+pb.h<tb.y-4 || pb.y>tb.y+tb.h+4);
    }
    // coleta página
    for (const e of this.entities){ if(e.onOverlap){
      const a=this.player.bbox, b=e.bbox;
      if(!(a.x+a.w<b.x || a.x>b.x+b.w || a.y+a.h<b.y || a.y>b.y+b.h)){ e.onOverlap(this); }
    }}
    this.player.update(this);
    // HUD fade
    if (hudEl.classList.contains("on") && performance.now()-this._lastHudT>3000){
      hudEl.classList.remove("on");
    }
  }
  draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    this.world.map.draw(ctx);
    for (const e of this.entities) e.draw?.(ctx);
    this.player.draw(ctx);
    if (this.canUse){
      ctx.fillStyle="rgba(255,255,255,0.85)";
      ctx.font="12px ui-monospace, Consolas, monospace";
      ctx.fillText("Pressione E para usar o terminal", 12, canvas.height-14);
    }
  }
}
const GAME = new Game();
GAME.load(1);

// loop
function loop(){
  GAME.update(); GAME.draw(); requestAnimationFrame(loop);
}
loop();

// Atalhos debug seleção de fase (opcional)
document.getElementById("btnNext")?.addEventListener("click", ()=>{
  const cur = GAME.world.id; const nxt = cur+1>LEVELS.length?1:cur+1; GAME.load(nxt);
});
document.getElementById("btnReset")?.addEventListener("click", ()=>GAME.load(GAME.world.id));

// Logout (botão Sair no header)
document.getElementById("btnLogout")?.addEventListener("click", async ()=>{
  try { await window.firebaseSignOut?.(); } catch(e) {}
});
