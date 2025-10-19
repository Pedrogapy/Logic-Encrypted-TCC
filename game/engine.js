// Pequeno motor 2D com movimento e colisão separada (X depois Y)

export class Vec2 {
  constructor(x=0,y=0){ this.x=x; this.y=y; }
  set(x,y){ this.x=x; this.y=y; return this; }
  copy(){ return new Vec2(this.x, this.y); }
}

export class Rect {
  constructor(x,y,w,h){ this.x=x; this.y=y; this.w=w; this.h=h; }
  get left(){ return this.x; }
  get right(){ return this.x + this.w; }
  get top(){ return this.y; }
  get bottom(){ return this.y + this.h; }
  intersects(r){
    return !(this.right<=r.left || this.left>=r.right || this.bottom<=r.top || this.top>=r.bottom);
  }
}

export function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

// Resolve colisão separando e impedindo “quique”
export function moveWithCollisions(body, dx, dy, solids){
  // move em X
  body.x += dx;
  for(const s of solids){
    if (body.intersects(s)){
      if (dx > 0) body.x = s.left - body.w; // vindo da esquerda
      else if (dx < 0) body.x = s.right;     // vindo da direita
    }
  }
  // move em Y
  body.y += dy;
  for(const s of solids){
    if (body.intersects(s)){
      if (dy > 0) body.y = s.top - body.h;  // vindo de cima
      else if (dy < 0) body.y = s.bottom;   // vindo de baixo
    }
  }
}

export class Input {
  constructor(){
    this.keys = new Set();
    window.addEventListener('keydown', e => this.keys.add(e.key.toLowerCase()));
    window.addEventListener('keyup',   e => this.keys.delete(e.key.toLowerCase()));
  }
  down(k){ return this.keys.has(k.toLowerCase()); }
  pressedAny(...arr){ return arr.some(k => this.down(k)); }
}

export class Timer {
  constructor(){ this.acc=0; this.last=performance.now(); }
  tick(){
    const now=performance.now(); const dt=(now-this.last)/1000; this.last=now; return dt;
  }
}
