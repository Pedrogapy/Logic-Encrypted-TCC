import {Door, Page, Terminal, Player} from "./entities.js";

/** Descreve cada sala e gera o mundo (mapa + entidades) */
export const LEVELS = [
  { // Sala 1 — tutorial
    id:1, name:"Corredor de Introdução",
    map:{ w:1024, h:560,
      walls:[
        {x:40,y:80,w:944,h:24},{x:40,y:456,w:944,h:24},{x:40,y:80,w:24,h:400},{x:960,y:80,w:24,h:400},
      ],
      torches:[{x:100,y:116},{x:930,y:116}]
    },
    player:{x:80,y:400},
    door:{x:930,y:400,w:24,h:64},
    terminal:{x:520,y:380},
    pages:[{x:190,y:400,key:"variaveis"}]
  },
  { // Sala 2 — Galeria
    id:2, name:"Galeria da Lógica",
    map:{ w:1024, h:560,
      walls:[
        {x:40,y:80,w:944,h:24},{x:40,y:456,w:944,h:24},{x:40,y:80,w:24,h:400},{x:960,y:80,w:24,h:400},
        {x:300,y:160,w:44,h:180},{x:520,y:120,w:44,h:240},{x:740,y:160,w:44,h:180}
      ],
      torches:[{x:140,y:116},{x:520,y:116},{x:900,y:116}]
    },
    player:{x:80,y:400},
    door:{x:930,y:120,w:24,h:64},
    terminal:{x:760,y:360},
    pages:[{x:180,y:140,key:"condicionais"},{x:360,y:420,key:"operadores"}]
  }
];

function drawGrid(ctx,w,h){
  // piso quadriculado discreto
  ctx.fillStyle="#0b0f18";
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(255,255,255,0.04)";
  ctx.lineWidth=1;
  for(let x=0;x<w;x+=32){ ctx.beginPath(); ctx.moveTo(x+0.5,0); ctx.lineTo(x+0.5,h); ctx.stroke(); }
  for(let y=0;y<h;y+=32){ ctx.beginPath(); ctx.moveTo(0,y+0.5); ctx.lineTo(w,y+0.5); ctx.stroke(); }

  // vinheta
  const vg=ctx.createRadialGradient(w/2,h/2,60,w/2,h/2,Math.max(w,h));
  vg.addColorStop(0,"rgba(0,0,0,0)");
  vg.addColorStop(1,"rgba(0,0,0,0.45)");
  ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);
}

function drawWalls(ctx,walls){
  // blocos de pedra
  for(const r of walls){
    ctx.fillStyle="#22283f";
    ctx.fillRect(r.x,r.y,r.w,r.h);
    // textura suave
    ctx.fillStyle="rgba(255,255,255,0.03)";
    for(let y=r.y;y<r.y+r.h;y+=12){
      for(let x=r.x;x<r.x+r.w;x+=12){
        ctx.fillRect(x+Math.random()*2,y+Math.random()*2,8,8);
      }
    }
    ctx.strokeStyle="#0e1324"; ctx.lineWidth=2;
    ctx.strokeRect(r.x+0.5,r.y+0.5,r.w-1,r.h-1);
  }
}

function drawTorches(ctx,torches){
  if(!torches) return;
  for(const t of torches){
    const flick = 0.85 + Math.random()*0.3;
    const g = ctx.createRadialGradient(t.x,t.y,6,t.x,t.y,90);
    g.addColorStop(0,`rgba(255,180,80,${0.45*flick})`);
    g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g; ctx.fillRect(t.x-100,t.y-100,200,200);

    ctx.fillStyle="#ffb454";
    ctx.fillRect(t.x-3,t.y-3,6,6);
  }
}

export function buildLevel(def){
  const map = {
    w:def.map.w, h:def.map.h, walls:def.map.walls, torches:def.map.torches || [],
    draw(ctx){
      drawGrid(ctx,this.w,this.h);
      drawWalls(ctx,this.walls);
      drawTorches(ctx,this.torches);
    }
  };

  const entities = [];
  // paredes sólidas invisíveis (já desenhadas no map)
  for(const r of def.map.walls){
    entities.push({
      x:r.x,y:r.y,w:r.w,h:r.h, solid:true,
      get bbox(){return {x:this.x,y:this.y,w:this.w,h:this.h}},
      draw(){}
    });
  }

  if(def.pages) for(const p of def.pages) entities.push(new Page(p.x,p.y,p.key));
  if(def.terminal) entities.push(new Terminal(def.terminal.x, def.terminal.y));
  if(def.door){ const d = new Door(def.door.x, def.door.y, def.door.w, def.door.h); entities.push(d); }

  const player = new Player(def.player.x, def.player.y);
  return { id:def.id, name:def.name, map, entities, player };
}

window.LEVELS = LEVELS;
