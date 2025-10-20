/* =========================================================
   LOGIC-ENCRYPTED — motorzinho top-down simples (canvas)
   Sala 1: uma PÁGINA (E perto) + um TERMINAL (E perto) + PORTA.
   Colisão por eixo (não arremessa). HUD + progresso em localStorage.
   Teclas: WASD mover — E interagir — C fechar/abrir caderno quando aberto.
   ========================================================= */

//// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
function setText(id, v){ const el = document.getElementById(id); if(el) el.textContent = String(v); }

const Save = {
  KEY: "le:lastCleared",
  get(){ const n = Number(localStorage.getItem(this.KEY)); return Number.isFinite(n)?n:0; },
  set(n){ localStorage.setItem(this.KEY, String(n)); }
};

// AABB simples
function rectsOverlap(a,b){
  return !(a.x+a.w<=b.x || a.x>=b.x+b.w || a.y+a.h<=b.y || a.y>=b.y+b.h);
}
function dist2(a,b){
  const dx=a.x-b.x, dy=a.y-b.y; return dx*dx+dy*dy;
}

//// ---------- Game ----------
class Game {
  constructor(){
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas?.getContext("2d") ?? null;

    this.ts = 48;                       // tile size
    this.cols = 20; this.rows = 11;     // 960x528 área útil
    this.width = this.cols*this.ts;
    this.height = this.rows*this.ts;

    this.keys = new Set();
    this.hint = document.getElementById("hint");

    // Progresso
    this.lastCleared = Save.get();

    // Estados
    this.objects = []; // {type,pos...}
    this.player = { x: 2*this.ts+8, y: 8*this.ts, w:28, h:28, spd: 180 };
    this.door = { x: 18*this.ts+10, y: 6*this.ts+6, w: 24, h: 84, open:false };

    // mapa (1=parede, 0=chão) — uma cripta simples
    this.map = [
      "11111111111111111111",
      "1..................1",
      "1...1....1.....1...1",
      "1..................1",
      "1...1....1.....1...1",
      "1..................1",
      "1...1.........1....1",
      "1..................1",
      "1...1....1.....1...1",
      "1..................1",
      "11111111111111111111",
    ];

    // Objetos sala 1
    this.page = { type:"page", x: 4*this.ts+8, y: 4*this.ts+8, w:32, h:32, r:34 };
    this.terminal = { type:"terminal", x: 14*this.ts+8, y: 6*this.ts+8, w:32, h:32, r:34 };
    this.objects.push(this.page, this.terminal);

    // Bind UI
    $("#btn-restart")?.addEventListener("click", ()=>this.reset());
    $("#btn-next")?.addEventListener("click", ()=>this.next());
    $("#btn-logout")?.addEventListener("click", ()=>this.logout());
    document.querySelectorAll("[data-close]").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        const sel = btn.getAttribute("data-close");
        if(sel) $(sel).hidden = true;
      });
    });

    // Terminal form
    $("#terminal-form")?.addEventListener("submit", (e)=>{
      e.preventDefault();
      const v = ($("#answer")?.value ?? "").trim().toLowerCase();
      const ok = (v === "par" || v === '"par"' || v === "'par'");
      const msg = $("#terminal-msg");
      if(ok){
        msg.textContent = "Correto! A porta foi liberada.";
        msg.style.color = "#6df2bd";
        this.door.open = true;
      }else{
        msg.textContent = "Ainda não. Dica: 6 % 2 === 0 ⇒ número par ⇒ “par”.";
        msg.style.color = "#ffb4b4";
      }
    });

    // Entrada
    window.addEventListener("keydown", (e)=>{
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
      if(e.repeat) return;
      this.keys.add(e.key.toLowerCase());
      // Interações
      if(e.key.toLowerCase()==="e") this.tryInteract();
      if(e.key.toLowerCase()==="c") this.toggleNotebook(); // só fecha/abre se modal estiver presente
    });
    window.addEventListener("keyup", (e)=> this.keys.delete(e.key.toLowerCase()));

    // HUD
    setText("last-cleared", this.lastCleared);

    // Loop
    this.last = performance.now();
    requestAnimationFrame(this.loop);
  }

  logout(){
    // seu fluxo real de logout: limpei progresso e recarreguei
    localStorage.removeItem(Save.KEY);
    window.location.href = "./"; // volte à sua tela inicial de login se tiver
  }

  reset(){
    this.player.x = 2*this.ts+8; this.player.y = 8*this.ts;
    this.door.open = false;
    $("#terminal-msg") && ($("#terminal-msg").textContent="");
    $("#modal-terminal") && ($("#modal-terminal").hidden = true);
    $("#modal-notebook") && ($("#modal-notebook").hidden = true);
  }

  next(){
    // stub: aqui você carregaria a sala 2
    alert("Exemplo carrega só a Sala 1 por enquanto. :)");
  }

  // ---------- Interações ----------
  toggleNotebook(){
    const box = $("#modal-notebook");
    if(!box) return;
    box.hidden = !box.hidden;
  }

  near(a,b){
    const ax=a.x+a.w/2, ay=a.y+a.h/2, bx=b.x+b.w/2, by=b.y+b.h/2;
    const dx=ax-bx, dy=ay-by;
    return (dx*dx+dy*dy) <= (b.r*b.r);
  }

  tryInteract(){
    // Página
    if(this.near(this.player, this.page)){
      $("#modal-notebook") && ($("#modal-notebook").hidden = false);
      return;
    }
    // Terminal
    if(this.near(this.player, this.terminal)){
      $("#modal-terminal") && ($("#modal-terminal").hidden = false);
      $("#answer") && ($("#answer").focus());
      return;
    }
  }

  // ---------- Colisão ----------
  isSolidAt(px,py){
    const c = Math.floor(px/this.ts), r=Math.floor(py/this.ts);
    if(r<0||c<0||r>=this.rows||c>=this.cols) return true;
    return this.map[r][c] === "1";
  }
  resolveAxis(box, dx, dy){
    let nx = box.x + dx, ny = box.y + dy;
    // vertical first? fazemos separado por eixo
    if(dx!==0){
      const sign = Math.sign(dx);
      // checa duas amostras verticais nas bordas
      const y1 = ny+2, y2 = ny+box.h-2;
      const ahead = (sign>0) ? nx+box.w : nx;
      if(this.isSolidAt(ahead, y1) || this.isSolidAt(ahead, y2)){
        // aproxima até a parede
        const tile = Math.floor(ahead/this.ts);
        nx = (sign>0 ? tile*this.ts - box.w - 0.01 : (tile+1)*this.ts + 0.01);
      }
    }
    if(dy!==0){
      const sign = Math.sign(dy);
      const x1 = nx+2, x2 = nx+box.w-2;
      const ahead = (sign>0) ? ny+box.h : ny;
      if(this.isSolidAt(x1, ahead) || this.isSolidAt(x2, ahead)){
        const tile = Math.floor(ahead/this.ts);
        ny = (sign>0 ? tile*this.ts - box.h - 0.01 : (tile+1)*this.ts + 0.01);
      }
    }
    box.x = nx; box.y = ny;
  }

  // ---------- Loop ----------
  loop = (now)=>{
    const dt = Math.min(0.033, (now-this.last)/1000); this.last = now;
    this.update(dt); this.render();
    requestAnimationFrame(this.loop);
  };

  update(dt){
    // movimento
    let vx=0, vy=0;
    if(this.keys.has("w")) vy-=1;
    if(this.keys.has("s")) vy+=1;
    if(this.keys.has("a")) vx-=1;
    if(this.keys.has("d")) vx+=1;
    if(vx||vy){ const l=Math.hypot(vx,vy); vx/=l; vy/=l; }
    const spd = this.player.spd;
    // resolve por eixo (não arremessa)
    this.resolveAxis(this.player, vx*spd*dt, 0);
    this.resolveAxis(this.player, 0, vy*spd*dt);

    // hint de interação
    let showHint = false;
    if(this.near(this.player, this.page) || this.near(this.player, this.terminal)) showHint = true;
    if(this.hint) this.hint.hidden = !showHint;

    // atravessou a porta aberta ⇒ conclui
    if(this.door.open){
      const goal = { x: this.door.x, y:this.door.y, w:this.door.w, h:this.door.h };
      if(rectsOverlap({x:this.player.x,y:this.player.y,w:this.player.w,h:this.player.h}, goal)){
        this.onComplete();
      }
    }
  }

  onComplete(){
    this.lastCleared = Math.max(this.lastCleared, 1);
    Save.set(this.lastCleared);
    setText("last-cleared", this.lastCleared);
    // reposiciona jogador fora
    this.player.x = 2*this.ts+8; this.player.y = 8*this.ts;
    this.door.open = false;
    $("#modal-terminal") && ($("#modal-terminal").hidden = true);
    $("#terminal-msg") && ($("#terminal-msg").textContent = "");
    alert("Sala concluída! (Progresso salvo)");
  }

  // ---------- Render ----------
  render(){
    if(!this.ctx) return;
    const ctx=this.ctx, ts=this.ts;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    // grid de fundo (cripta)
    ctx.fillStyle = "#0d1320";
    ctx.fillRect(0,0,this.width,this.height);
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for(let c=0;c<=this.cols;c++){ ctx.beginPath(); ctx.moveTo(c*ts,0); ctx.lineTo(c*ts,this.height); ctx.stroke(); }
    for(let r=0;r<=this.rows;r++){ ctx.beginPath(); ctx.moveTo(0,r*ts); ctx.lineTo(this.width,r*ts); ctx.stroke(); }

    // paredes
    for(let r=0;r<this.rows;r++){
      for(let c=0;c<this.cols;c++){
        if(this.map[r][c]==="1"){
          ctx.fillStyle = "#243152";
          ctx.fillRect(c*ts, r*ts, ts, ts);
          // borda
          ctx.strokeStyle = "#1b243d";
          ctx.strokeRect(c*ts+0.5, r*ts+0.5, ts-1, ts-1);
        }
      }
    }

    // porta
    ctx.fillStyle = this.door.open? "#5af2b8" : "#245a48";
    ctx.fillRect(this.door.x, this.door.y, this.door.w, this.door.h);
    // detalhes porta
    ctx.strokeStyle = this.door.open? "#98ffd8" : "#2b7a63";
    ctx.strokeRect(this.door.x+0.5, this.door.y+0.5, this.door.w-1, this.door.h-1);

    // objetos: page e terminal
    // página (azul)
    ctx.fillStyle = "#5aa3ff";
    ctx.fillRect(this.page.x, this.page.y, this.page.w, this.page.h);
    // terminal (amarelo)
    ctx.fillStyle = "#ffb84d";
    ctx.fillRect(this.terminal.x, this.terminal.y, this.terminal.w, this.terminal.h);

    // player
    ctx.fillStyle = "#75f7ff";
    ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
  }
}

//// ---------- Boot ----------
window.addEventListener("DOMContentLoaded", ()=>{
  // (se tiver email real do usuário, injete aqui)
  setText("user-email", localStorage.getItem("le:userEmail") || "aluno@exemplo.com");
  new Game();
});
