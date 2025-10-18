// main.js — integra tudo, HUD, puzzles, porta e progressão
import { Input, rectsIntersect } from "./core.js";
import { LEVELS, buildLevel } from "./levels.js";

(function(){
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  Input.init();

  const HUD = {
    set(msg){ const el = document.getElementById("hud-msg"); if (el) el.textContent = msg||""; },
    next(on){ const b = document.getElementById("btn-proximo"); if(b) b.disabled = !on; }
  };

  class Game {
    constructor(){
      this.levelIndex = 1;
      this.world = null;
      this.entities = null; // <- atalhos (fix)
      this.map = null;      // <- atalhos (fix)
      this.notes = new Set();
      this._loop = this._loop.bind(this);
    }

    start({startLevel=1}={}){
      this.levelIndex = Math.max(1, Math.min(startLevel, LEVELS.length));
      this.load(this.levelIndex);
      requestAnimationFrame(this._loop);
      dispatchEvent(new Event("game-ready"));
    }

    load(i){
      const def = LEVELS[i-1];
      this.world = buildLevel(def);

      // ----- ATALHOS IMPORTANTES (consertam o erro) -----
      this.entities = this.world.entities;
      this.map      = this.world.map;
      // ---------------------------------------------------

      this.entities.forEach(e => e.game = this);
      this.player = this.world.player; 
      this.player.game = this;

      HUD.set(`Sala ${this.world.id}: ${this.world.name} — ache a página, use o terminal, abra a porta.`);
      HUD.next(false);
    }

    restartLevel(){ this.load(this.levelIndex); }

    nextLevel(){
      if (this.levelIndex < LEVELS.length){
        this.levelIndex++;
        this.load(this.levelIndex);
      }
    }

    collectNote(key){
      this.notes.add(key);
      if (window.PuzzleEngine?.openNotebook) window.PuzzleEngine.openNotebook([...this.notes]);
      HUD.set("Você encontrou uma página! Abra o caderno para estudar.");
    }

    unlockDoor(){
      const door = this.entities.find(e => e.solid === true);
      if (door) door.open = true;
      HUD.next(true);
    }

    setHUD(msg){ HUD.set(msg); }

    tryInteract(player){
      // Terminal por perto?
      const term = this.entities.find(e => e.constructor.name==="Terminal" && dist(player,e) <= 40);
      if (term) return term.use(this);

      // Porta aberta → avançar
      const door = this.entities.find(e => e.constructor.name==="Door");
      if (door && door.open && rectsIntersect(player.bbox, door.bbox)){
        const user = window.GameBridge?.user;
        if (user && window.GameBridge?.saveProgress){
          window.GameBridge.saveProgress(user.uid, this.world.id).then(novo=>{
            if (typeof novo==="number"){
              const lab = document.getElementById("progresso-label");
              if (lab) lab.textContent = String(novo);
            }
          });
        }
        this.nextLevel();
      }
    }

    update(){
      this.player.update(this);
      for (const e of this.entities){ if (e.update) e.update(this); }
      // páginas por overlap
      for (const e of this.entities){
        if (e.onOverlap && rectsIntersect(this.player.bbox, e.bbox)) e.onOverlap(this, this.player);
      }
    }

    draw(){
      this.map.draw(ctx);
      for (const e of this.entities){ e.draw(ctx); }
      this.player.draw(ctx);

      const t = this.entities.find(e => e.constructor.name==="Terminal" && dist(this.player,e)<=40);
      if (t){ drawText(ctx, "Pressione E para usar o terminal", this.player.x-20, this.player.y-18); }

      const door = this.entities.find(e => e.constructor.name==="Door");
      if (door && door.open && rectsIntersect(this.player.bbox, door.bbox)){
        drawText(ctx, "Porta aberta — avance ▶", door.x-10, door.y-18);
      }
    }

    _loop(){
      requestAnimationFrame(this._loop);
      if (!this.world) return;
      this.update(); this.draw();
    }
  }

  function drawText(c, txt, x, y){
    c.fillStyle="rgba(0,0,0,.6)";
    const w = c.measureText(txt).width + 14;
    c.fillRect(x-6,y-16, w, 22);
    c.fillStyle="#fff"; c.font="14px system-ui,Arial"; c.fillText(txt, x, y);
  }
  function dist(a,b){
    const dx=(a.x+12)-(b.x+b.w/2), dy=(a.y+12)-(b.y+b.h/2);
    return Math.hypot(dx,dy);
  }

  window.Game = new Game();
})();
