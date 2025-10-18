import {Input, rectsIntersect} from "./core.js";

/** Resolve movimento em um único eixo “encostando” no sólido mais próximo */
function sweepAxis(entity, solids, dx, dy){
  if (dx !== 0) {
    let newX = entity.x + dx;
    const bbox = {x:newX, y:entity.y, w:entity.w, h:entity.h};

    for (const s of solids){
      if (!s.solid) continue;
      // testa se haveria interseção neste X
      if (!(bbox.x + bbox.w < s.x || bbox.x > s.x + s.w || bbox.y + bbox.h < s.y || bbox.y > s.y + s.h)){
        if (dx > 0) newX = Math.min(newX, s.x - entity.w);
        else        newX = Math.max(newX, s.x + s.w);
        // atualiza AABB de teste após “encostar”
        bbox.x = newX;
      }
    }
    entity.x = newX;
  }

  if (dy !== 0) {
    let newY = entity.y + dy;
    const bbox = {x:entity.x, y:newY, w:entity.w, h:entity.h};

    for (const s of solids){
      if (!s.solid) continue;
      if (!(bbox.x + bbox.w < s.x || bbox.x > s.x + s.w || bbox.y + bbox.h < s.y || bbox.y > s.y + s.h)){
        if (dy > 0) newY = Math.min(newY, s.y - entity.h);
        else        newY = Math.max(newY, s.y + s.h);
        bbox.y = newY;
      }
    }
    entity.y = newY;
  }
}

/* ===== Player ===== */
export class Player {
  constructor(x,y){
    this.x=x; this.y=y; this.w=24; this.h=24;
    this.speed=2.1; this.color="#5fdcb1"; this.game=null;
  }
  get bbox(){ return {x:this.x,y:this.y,w:this.w,h:this.h}; }

  update(game){
    const solids = (game?.entities ?? []).filter(e => e.solid);

    let dx=0, dy=0;
    if(Input.isDown("w") || Input.isDown("arrowup")) dy-=1;
    if(Input.isDown("s") || Input.isDown("arrowdown")) dy+=1;
    if(Input.isDown("a") || Input.isDown("arrowleft")) dx-=1;
    if(Input.isDown("d") || Input.isDown("arrowright")) dx+=1;

    // normaliza e aplica velocidade
    const len = Math.hypot(dx,dy) || 1;
    dx = (dx/len) * this.speed;
    dy = (dy/len) * this.speed;

    // move de forma robusta por eixo
    sweepAxis(this, solids, dx, 0);
    sweepAxis(this, solids, 0, dy);

    if (Input.isDown("e")) game.tryInteract?.(this);
  }

  draw(ctx){
    ctx.fillStyle=this.color; ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#1a2b2a"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}

/* ===== Porta ===== */
export class Door {
  constructor(x,y,w,h){ this.x=x; this.y=y; this.w=w; this.h=h; this.open=false; }
  get solid(){ return !this.open; }
  get bbox(){return {x:this.x,y:this.y,w:this.w,h:this.h};}
  draw(ctx){
    ctx.fillStyle = this.open ? "#2ecc71" : "#9b59b6";
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#221a32"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}

/* ===== Terminal ===== */
export class Terminal {
  constructor(x,y){ this.x=x; this.y=y; this.w=22; this.h=22; this.color="#ffd166"; }
  get bbox(){return {x:this.x,y:this.y,w:this.w,h:this.h};}
  use(game){
    window.PuzzleEngine?.openForLevel?.(game.world.id, result=>{
      if(result?.ok){ game.unlockDoor(); game.setHUD("Porta desbloqueada! Vá até a saída."); }
      else { game.setHUD("Resposta incorreta. Estude a página e tente de novo (C)."); }
    });
  }
  draw(ctx){
    ctx.fillStyle=this.color; ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#2a2412"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}

/* ===== Página (coletável) ===== */
export class Page {
  constructor(x,y,key){ this.x=x; this.y=y; this.w=18; this.h=18; this.key=key; this.collected=false; }
  get bbox(){return {x:this.x,y:this.y,w:this.w,h:this.h};}
  onOverlap(game){
    if(this.collected) return;
    this.collected=true;
    game.collectNote?.(this.key);
  }
  draw(ctx){
    if(this.collected) return;
    const x=this.x,y=this.y,w=this.w,h=this.h;
    ctx.fillStyle="#6aa0ff"; ctx.fillRect(x,y,w,h);
    ctx.fillStyle="#27407d"; ctx.fillRect(x+3,y+3,w-6,h-10);
    ctx.strokeStyle="#15203d"; ctx.lineWidth=2; ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
  }
}
