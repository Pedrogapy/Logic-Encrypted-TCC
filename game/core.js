export const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
export const rectsIntersect = (a,b)=>!(a.x+a.w<b.x || a.x>b.x+b.w || a.y+a.h<b.y || a.y>b.y+b.h);

export const Input = {
  keys:new Set(),
  init(){
    addEventListener("keydown",e=>{
      this.keys.add(e.key.toLowerCase());
      if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase()))
        e.preventDefault();
    });
    addEventListener("keyup",e=>this.keys.delete(e.key.toLowerCase()));
  },
  isDown(k){ return this.keys.has(k); }
};
