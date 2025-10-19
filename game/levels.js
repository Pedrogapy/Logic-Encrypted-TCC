// game/levels.js
// -----------------------------------------------------------------------------
// Estrutura compatível com o motor atual (main.js, entities.js, puzzle.js)
//
// Cada fase contém:
// - paredes sólidas
// - spawn do jogador
// - terminal que abre o puzzle com base no id da fase
// - 1 página de caderno
// - 1 porta de saída (abre após resolver o puzzle)
// -----------------------------------------------------------------------------

import { Door, Page, Terminal, Player } from "./entities.js";

function drawGrid(ctx, w, h) {
  ctx.fillStyle = "#0b0f18";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, Math.max(w, h));
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawWalls(ctx, walls) {
  for (const r of walls) {
    ctx.fillStyle = "#22283f";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = "#0e1324";
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
  }
}

function drawTorches(ctx, torches) {
  for (const t of torches || []) {
    const f = 0.9 + Math.random() * 0.2;
    const g = ctx.createRadialGradient(t.x, t.y, 6, t.x, t.y, 100);
    g.addColorStop(0, `rgba(255,180,80,${0.4 * f})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(t.x - 110, t.y - 110, 220, 220);
    ctx.fillStyle = "#ffb454";
    ctx.fillRect(t.x - 3, t.y - 3, 6, 6);
  }
}

// -----------------------------------------------------------------------------
// Definição dos níveis
// -----------------------------------------------------------------------------

export const LEVELS = [
  // ---------------------------------------------------------------------------
  // FASE 1 — Condicionais (if/else)
  // ---------------------------------------------------------------------------
  {
    id: 1,
    name: "Galeria — Introdução (Condicionais)",
    map: {
      w: 1024,
      h: 560,
      walls: [
        { x: 40, y: 80, w: 944, h: 24 }, // teto
        { x: 40, y: 456, w: 944, h: 24 }, // chão
        { x: 40, y: 80, w: 24, h: 400 }, // esquerda
        { x: 960, y: 80, w: 24, h: 400 }, // direita
        { x: 300, y: 200, w: 40, h: 200 },
        { x: 520, y: 200, w: 40, h: 200 },
        { x: 740, y: 200, w: 40, h: 200 },
      ],
      torches: [
        { x: 140, y: 120 },
        { x: 500, y: 120 },
        { x: 880, y: 120 },
      ],
    },
    player: { x: 80, y: 400 },
    door: { x: 930, y: 400, w: 24, h: 64 },
    terminal: { x: 520, y: 400 },
    pages: [{ x: 200, y: 400, key: "ifelse" }], // Página de Condicionais
  },

  // ---------------------------------------------------------------------------
  // FASE 2 — Módulo (%) Par/Ímpar
  // ---------------------------------------------------------------------------
  {
    id: 2,
    name: "Galeria da Lógica (Módulo %)",
    map: {
      w: 1024,
      h: 560,
      walls: [
        { x: 40, y: 80, w: 944, h: 24 },
        { x: 40, y: 456, w: 944, h: 24 },
        { x: 40, y: 80, w: 24, h: 400 },
        { x: 960, y: 80, w: 24, h: 400 },
        { x: 300, y: 160, w: 44, h: 180 },
        { x: 520, y: 120, w: 44, h: 240 },
        { x: 740, y: 160, w: 44, h: 180 },
      ],
      torches: [
        { x: 160, y: 116 },
        { x: 520, y: 116 },
        { x: 880, y: 116 },
      ],
    },
    player: { x: 80, y: 400 },
    door: { x: 930, y: 120, w: 24, h: 64 },
    terminal: { x: 760, y: 360 },
    pages: [{ x: 400, y: 420, key: "modulo" }], // Página de módulo
  },
];

// -----------------------------------------------------------------------------
// Construtor de fase
// -----------------------------------------------------------------------------

export function buildLevel(def) {
  const map = {
    w: def.map.w,
    h: def.map.h,
    walls: def.map.walls,
    torches: def.map.torches || [],
    draw(ctx) {
      drawGrid(ctx, this.w, this.h);
      drawWalls(ctx, this.walls);
      drawTorches(ctx, this.torches);
    },
  };

  const entities = [];

  // paredes sólidas
  for (const r of def.map.walls) {
    entities.push({
      x: r.x,
      y: r.y,
      w: r.w,
      h: r.h,
      solid: true,
      get bbox() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
      },
      draw() {},
    });
  }

  // páginas coletáveis
  if (def.pages)
    for (const p of def.pages) entities.push(new Page(p.x, p.y, p.key));

  // terminal
  if (def.terminal)
    entities.push(new Terminal(def.terminal.x, def.terminal.y));

  // porta
  let door = null;
  if (def.door) {
    door = new Door(def.door.x, def.door.y, def.door.w, def.door.h);
    entities.push(door);
  }

  const player = new Player(def.player.x, def.player.y);

  return { id: def.id, name: def.name, map, entities, player, door };
}
