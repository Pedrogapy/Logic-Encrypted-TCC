import {Input, rectsIntersect} from "./core.js";

/* ===== Player ===== */
export class Player {
  constructor(x,y){
    this.x=x; this.y=y; this.w=24; this.h=24;
    this.speed=2.2; this.color="#5fdcb1"; this.game=null;
  }
  get bbox(){ return {x:this.x,y:this.y,w:this.w,h:this.h}; }

  update(game){
    const entities = game?.entities ?? [];

    let dx=0, dy=0;
    if(Input.isDown("w") || Input.isDown("arrowup")) dy-=1;
    if(Input.isDown("s") || Input.isDown("arrowdown")) dy+=1;
    if(Input.isDown("a") || Input.isDown("arrowleft")) dx-=1;
    if(Input.isDown("d") || Input.isDown("arrowright")) dx+=1;
    const len = Math.hypot(dx,dy) || 1;
    dx = dx/len*this.speed; dy=dy/len*this.speed;

    // movimentação com colisão
    this.x += dx;
    for(const s of entities.filter(e=>e.solid)) if(rectsIntersect(this.bbox,s.bbox)){
      if(dx>0) this.x = s.x - this.w; else if(dx<0) this.x = s.x+s.w;
    }
    this.y += dy;
    for(const s of entities.filter(e=>e.solid)) if(rectsIntersect(this.bbox,s.bbox)){
      if(dy>0) this.y = s.y - this.h; else if(dy<0) this.y = s.y+s.h;
    }

    if (Input.isDown("e")) game.tryInteract?.(this);
  }

  draw(ctx){
    // player estilizado com contorno
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
    ctx.fillStyle="#27407d"; ctx.fillRect(x+3,y+3,w-6,h-10); // “texto”
    ctx.strokeStyle="#15203d"; ctx.lineWidth=2; ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
  }
}
