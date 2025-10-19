// /game/entities.js
import {Input} from "./core.js";

/** resolve por eixo sem "empurrões": encosta no sólido mais próximo */
function moveAxis(entity, solids, dx, dy){
  if (dx !== 0){
    let newX = entity.x + dx;
    const bb = {x:newX, y:entity.y, w:entity.w, h:entity.h};
    for (const s of solids){
      if(!s.solid) continue;
      if (!(bb.x + bb.w < s.x || bb.x > s.x + s.w || bb.y + bb.h < s.y || bb.y > s.y + s.h)){
        // colisão no X: gruda na borda
        if (dx > 0) newX = Math.min(newX, s.x - entity.w);
        else        newX = Math.max(newX, s.x + s.w);
        bb.x = newX;
      }
    }
    entity.x = newX;
  }
  if (dy !== 0){
    let newY = entity.y + dy;
    const bb = {x:entity.x, y:newY, w:entity.w, h:entity.h};
    for (const s of solids){
      if(!s.solid) continue;
      if (!(bb.x + bb.w < s.x || bb.x > s.x + s.w || bb.y + bb.h < s.y || bb.y > s.y + s.h)){
        if (dy > 0) newY = Math.min(newY, s.y - entity.h);
        else        newY = Math.max(newY, s.y + s.h);
        bb.y = newY;
      }
    }
    entity.y = newY;
  }
}

export class Player {
  constructor(x,y){
    this.x=x; this.y=y; this.w=24; this.h=24;
    this.speed=2.2; this.color="#5fdcb1";
  }
  get bbox(){return {x:this.x,y:this.y,w:this.w,h:this.h};}
  update(game){
    const solids = (game?.entities ?? []).filter(e=>e.solid);

    let dx=0, dy=0;
    if (Input.isDown("w") || Input.isDown("arrowup"))    dy -= 1;
    if (Input.isDown("s") || Input.isDown("arrowdown"))  dy += 1;
    if (Input.isDown("a") || Input.isDown("arrowleft"))  dx -= 1;
    if (Input.isDown("d") || Input.isDown("arrowright")) dx += 1;

    const len = Math.hypot(dx,dy) || 1;
    dx = (dx/len)*this.speed;
    dy = (dy/len)*this.speed;

    moveAxis(this, solids, dx, 0);
    moveAxis(this, solids, 0, dy);

    // “E” apenas tenta interagir (terminal/perto)
    if (Input.isDown("e") && game?.canUse){ game.tryInteract(this); }
  }
  draw(ctx){
    ctx.fillStyle=this.color; ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#163a37"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}

export class Door {
  constructor(x,y,w,h){ this.x=x; this.y=y; this.w=w; this.h=h; this.open=false; }
  get solid(){ return !this.open; }
  get bbox(){ return {x:this.x,y:this.y,w:this.w,h:this.h}; }
  draw(ctx){
    ctx.fillStyle = this.open ? "#2ecc71" : "#8e44ad";
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#271a34"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}

export class Terminal {
  constructor(x,y){ this.x=x; this.y=y; this.w=22; this.h=22; }
  get bbox(){ return {x:this.x,y:this.y,w:this.w,h:this.h}; }
  use(game){
    window.PuzzleEngine?.openForLevel?.(game.world.id, res=>{
      if(res?.ok){ game.unlockDoor(); game.setHUD("Porta desbloqueada! Vá até a saída."); }
      else { game.setHUD("Resposta incorreta. Consulte a página (C)."); }
    });
  }
  draw(ctx){
    ctx.fillStyle="#ffd166"; ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#3f2b10"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}

export class Page {
  constructor(x,y,key){ this.x=x; this.y=y; this.w=18; this.h=18; this.key=key; this.collected=false; }
  get bbox(){ return {x:this.x,y:this.y,w:this.w,h:this.h}; }
  onOverlap(game){
    if(this.collected) return;
    this.collected = true;
    game.collectNote?.(this.key);  // NÃO abre caderno automaticamente
    game.setHUD("Página coletada! Abra o caderno com C.");
  }
  draw(ctx){
    if(this.collected) return;
    ctx.fillStyle="#6aa0ff"; ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeStyle="#2c3e7d"; ctx.lineWidth=2; ctx.strokeRect(this.x+0.5,this.y+0.5,this.w-1,this.h-1);
  }
}
