// entities.js — Player, Porta, Terminal, Página, Inimigo
import { Input, rectsIntersect, resolveMoveAABB, TILE } from "./core.js";

export class Entity {
  constructor(x,y,w,h){ this.x=x; this.y=y; this.w=w; this.h=h; this.dead=false; }
  get bbox(){ return {x:this.x,y:this.y,w:this.w,h:this.h}; }
  update(_){} draw(_){} onOverlap(_) {}
}

export class Player extends Entity {
  constructor(x,y){ super(x,y,24,24); this.speed=3; this.color="#5b7cff"; this.vx=0; this.vy=0; }
  update(game){
    this.vx = (Input.down("ArrowRight","d","D")?this.speed:0) - (Input.down("ArrowLeft","a","A")?this.speed:0);
    this.vy = (Input.down("ArrowDown","s","S")?this.speed:0) - (Input.down("ArrowUp","w","W")?this.speed:0);
    const blockers = game.entities.filter(e => e.solid && (!e.open)); // porta fechada, etc
    const m = resolveMoveAABB(this, game.map, this.vx, this.vy, blockers.map(b=>b.bbox));
    this.x=m.x; this.y=m.y;

    // Interação
    if (Input.down("e","E")) game.tryInteract(this);
  }
  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

export class Door extends Entity {
  constructor(x,y,dir="v"){ super(x,y, dir==="h"?TILE*2:TILE, dir==="h"?TILE:TILE*2); this.solid = true; this.open = false; this.dir=dir; }
  draw(ctx){
    ctx.fillStyle = this.open ? "#2a693a" : "#6b3f2b";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    if (!this.open){
      ctx.strokeStyle="#000"; ctx.lineWidth=2;
      ctx.strokeRect(this.x+3,this.y+3,this.w-6,this.h-6);
    } else {
      // “aberta” visualmente
      ctx.clearRect(this.x+4,this.y+4,this.w-8,this.h-8);
    }
  }
}

export class Terminal extends Entity {
  constructor(x,y, puzzleId){ super(x,y,TILE,TILE); this.puzzleId = puzzleId; }
  draw(ctx){
    ctx.fillStyle="#224d7a"; ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.fillStyle="#9ad0ff"; ctx.fillRect(this.x+5,this.y+5,this.w-10,this.h-10);
  }
  use(game){
    // abre o modal do puzzle correspondente
    if (window.PuzzleEngine && typeof window.PuzzleEngine.open==="function"){
      window.PuzzleEngine.open(this.puzzleId, async (passed)=>{
        if (passed){
          game.unlockDoor(); // destravar porta desta sala
          game.setHUD("Porta destrancada! Vá até ela para seguir.");
        }
      });
    }
  }
}

export class PageNote extends Entity {
  constructor(x,y, noteKey){ super(x,y,TILE,TILE); this.noteKey = noteKey; this.collected=false; }
  draw(ctx){
    ctx.fillStyle = this.collected ? "rgba(255,255,255,0.15)" : "#d2b48c";
    ctx.fillRect(this.x+6,this.y+6,this.w-12,this.h-12);
  }
  onOverlap(game, other){
    if (!this.collected && other instanceof Player){
      this.collected = true;
      game.collectNote(this.noteKey);
    }
  }
}

export class EnemyPatrol extends Entity {
  constructor(x,y,path=[{x,y}],speed=1.6){ super(x,y,24,24); this.speed=speed; this.path=path; this.idx=0; }
  update(game){
    const p = this.path[this.idx];
    const dx = Math.sign(p.x - this.x) * this.speed;
    const dy = Math.sign(p.y - this.y) * this.speed;
    const m = resolveMoveAABB(this, game.map, dx, dy, game.entities.filter(e=>e.solid && !e.open).map(e=>e.bbox));
    this.x=m.x; this.y=m.y;
    if (Math.abs(this.x - p.x) < 2 && Math.abs(this.y - p.y) < 2) this.idx = (this.idx+1)%this.path.length;
    if (rectsIntersect(this.bbox, game.player.bbox)) game.restartLevel();
  }
  draw(ctx){
    ctx.fillStyle="#ff7675"; ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
