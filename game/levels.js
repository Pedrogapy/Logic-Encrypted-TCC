import {Door, Page, Terminal, Player} from "./entities.js";

/** Descreve cada sala e gera o mundo (mapa + entidades) */
export const LEVELS = [
  { // Sala 1 — tutorial
    id:1, name:"Corredor de Introdução",
    map:{ w:960, h:480, walls:[ {x:0,y:0,w:960,h:20},{x:0,y:460,w:960,h:20},{x:0,y:0,w:20,h:480},{x:940,y:0,w:20,h:480} ] },
    player:{x:80,y:380},
    door:{x:900,y:380,w:24,h:60},
    terminal:{x:520,y:360},
    pages:[{x:200,y:380,key:"variaveis"}]
  },
  { // Sala 2 — Galeria
    id:2, name:"Galeria da Lógica",
    map:{
      w:960, h:480,
      walls:[
        {x:0,y:0,w:960,h:20},{x:0,y:460,w:960,h:20},{x:0,y:0,w:20,h:480},{x:940,y:0,w:20,h:480},
        {x:260,y:140,w:40,h:200},{x:460,y:100,w:40,h:260},{x:660,y:140,w:40,h:200}
      ]
    },
    player:{x:80,y:380},
    door:{x:900,y:60,w:24,h:60},
    terminal:{x:760,y:340},
    pages:[{x:140,y:80,key:"condicionais"},{x:340,y:420,key:"operadores"}]
  }
];

export function buildLevel(def){
  const map = {
    w:def.map.w, h:def.map.h, walls:def.map.walls,
    draw(ctx){
      const grad = ctx.createLinearGradient(0,0,0,this.h);
      grad.addColorStop(0,"#0d1220"); grad.addColorStop(1,"#0b1020");
      ctx.fillStyle = grad; ctx.fillRect(0,0,this.w,this.h);
      ctx.fillStyle="#1f2945";
      for(const r of this.walls) ctx.fillRect(r.x,r.y,r.w,r.h);
    }
  };

  const entities = [];
  for(const r of def.map.walls){
    entities.push({
      x:r.x,y:r.y,w:r.w,h:r.h, solid:true,
      get bbox(){return {x:this.x,y:this.y,w:this.w,h:this.h}},
      draw(){}
    });
  }

  if(def.pages) for(const p of def.pages) entities.push(new Page(p.x,p.y,p.key));
  if(def.terminal) entities.push(new Terminal(def.terminal.x, def.terminal.y));
  let door=null;
  if(def.door){ door = new Door(def.door.x, def.door.y, def.door.w, def.door.h); entities.push(door); }

  const player = new Player(def.player.x, def.player.y);

  return {
    id:def.id, name:def.name,
    map, entities, player
  };
}

window.LEVELS = LEVELS;
