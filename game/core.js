// core.js — loop, input, util, colisão por tiles
export const TILE = 32;

export const Input = {
  keys: Object.create(null),
  init(){
    addEventListener("keydown", e => this.keys[e.key] = true);
    addEventListener("keyup",   e => this.keys[e.key] = false);
  },
  down(...names){ return names.some(k => !!this.keys[k]); }
};

export function rectsIntersect(a,b){
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export class Tilemap {
  constructor(lines){
    this.lines = lines; this.h = lines.length; this.w = lines[0]?.length || 0;
  }
  isSolidAt(px,py){
    const tx = Math.floor(px/TILE), ty = Math.floor(py/TILE);
    return this.isSolid(tx,ty);
  }
  isSolid(tx,ty){
    if (tx<0||ty<0||ty>=this.h||tx>=this.w) return true;
    const c = this.lines[ty][tx];
    return c === "#";
  }
  draw(ctx){
    ctx.fillStyle = "#0b0e1a"; ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    // piso quadriculado leve
    ctx.strokeStyle = "#101425";
    for(let x=0;x<=ctx.canvas.width;x+=TILE){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,ctx.canvas.height); ctx.stroke(); }
    for(let y=0;y<=ctx.canvas.height;y+=TILE){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(ctx.canvas.width,y); ctx.stroke(); }
    // paredes
    ctx.fillStyle = "#2a2f4a";
    for (let y=0;y<this.h;y++){
      const row = this.lines[y];
      for (let x=0;x<row.length;x++){
        if (row[x] === "#") ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
      }
    }
  }
}

export function resolveMoveAABB(ent, map, dx, dy, blockers=[]){
  // movimenta pixel a pixel; "blockers" são entidades sólidas extras (ex.: porta fechada)
  let nx = ent.x, ny = ent.y;
  const stepX = Math.abs(dx), dirx = Math.sign(dx);
  for (let i=0;i<stepX;i++){
    nx += dirx;
    if (collides(nx, ny, ent.w, ent.h, map, blockers)){ nx -= dirx; break; }
  }
  const stepY = Math.abs(dy), diry = Math.sign(dy);
  for (let i=0;i<stepY;i++){
    ny += diry;
    if (collides(nx, ny, ent.w, ent.h, map, blockers)){ ny -= diry; break; }
  }
  return {x:nx,y:ny};
}

function collides(x,y,w,h,map,blockers){
  // tiles
  const points = [
    [x+1,y+1],[x+w-1,y+1],[x+1,y+h-1],[x+w-1,y+h-1],[x+w/2,y+h/2]
  ];
  if (points.some(p=>map.isSolidAt(p[0],p[1]))) return true;
  // entidades sólidas extra
  for (const b of blockers){
    if (rectsIntersect({x,y,w,h}, b)) return true;
  }
  return false;
}
