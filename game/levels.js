// game/levels.js
// -------------------------------------------------------------
// Fases + utilitários para impedir que objetos fiquem "dentro"
// de paredes e para garantir caminho do jogador até a interação.
// -------------------------------------------------------------

/** Converte linhas de mapa (#=parede, .=piso) para 0/1 */
function parseMap(lines) {
  return lines.map(row => row.split("").map(ch => (ch === "#" ? 1 : 0)));
}

/** Limites básicos */
function inBounds(map, x, y) {
  const H = map.length;
  const W = map[0].length;
  return y >= 0 && y < H && x >= 0 && x < W;
}

/** Abre (seta 0) um tile se existir */
function open(map, x, y) {
  if (inBounds(map, x, y)) map[y][x] = 0;
}

/** Abre uma caixa centrada (largura/altura ímpares) */
function openBox(map, cx, cy, half = 1) {
  // half=1 => 3x3; half=2 => 5x5...
  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      open(map, cx + dx, cy + dy);
    }
  }
}

/** Abre “clareira” 3x3 + cruz maior (suave, mas garantido) */
function carveAround(map, x, y) {
  openBox(map, x, y, 1);     // 3x3
  open(map, x + 2, y);
  open(map, x - 2, y);
  open(map, x, y + 2);
  open(map, x, y - 2);
}

/** Abre um corredor em L (Manhattan) do (x0,y0) ao (x1,y1) */
function carveCorridor(map, x0, y0, x1, y1) {
  let x = x0, y = y0;
  const sx = x1 > x ? 1 : -1;
  while (x !== x1) {
    x += sx;
    open(map, x, y);
    open(map, x, y - 1);
    open(map, x, y + 1);
  }
  const sy = y1 > y ? 1 : -1;
  while (y !== y1) {
    y += sy;
    open(map, x, y);
    open(map, x - 1, y);
    open(map, x + 1, y);
  }
}

/** BFS: existe caminho 4-dir? */
function hasPath(map, from, to) {
  const H = map.length, W = map[0].length;
  const q = [[from.x, from.y]];
  const seen = new Set([from.x + "," + from.y]);
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === to.x && y === to.y) return true;
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      const key = nx + "," + ny;
      if (!inBounds(map, nx, ny)) continue;
      if (seen.has(key)) continue;
      if (map[ny][nx] === 0) {
        seen.add(key);
        q.push([nx, ny]);
      }
    }
  }
  return false;
}

/** Limpa 3x3 nos objetos e vizinhos relevantes (porta/saída) */
function ensureClearings(map, level) {
  const pts = [];
  if (level.player)   pts.push(level.player);
  if (level.exit)     pts.push(level.exit);
  if (level.door)     pts.push(level.door);
  (level.pages || []).forEach(p => pts.push(p));
  (level.terminals || []).forEach(t => pts.push(t));

  // 3x3 em cada ponto interativo
  pts.forEach(p => openBox(map, p.x, p.y, 1));

  // “área de frente” da porta
  if (level.door && level.exit) {
    const d = level.door;
    if (level.exit.x > d.x) openBox(map, d.x - 1, d.y, 1);
    else                    openBox(map, d.x + 1, d.y, 1);
  }
}

/** Garante conectividade: player -> página, terminal, porta, saída */
function ensureConnectivity(map, level) {
  const from = level.player;
  const targets = [];
  if (level.pages?.length)     targets.push(level.pages[0]);
  if (level.terminals?.length) targets.push(level.terminals[0]);
  if (level.door)              targets.push(level.door);
  if (level.exit)              targets.push(level.exit);

  for (const t of targets) {
    if (!hasPath(map, from, t)) {
      carveCorridor(map, from.x, from.y, t.x, t.y);
    }
    // abre 3x3 no alvo (caso corredor tenha “colado” nele)
    openBox(map, t.x, t.y, 1);
  }
}

/** Monta uma fase pronta */
function buildLevel(def) {
  const map = parseMap(def.map);
  ensureClearings(map, def);
  ensureConnectivity(map, def);

  return {
    id: def.id,
    title: def.title,
    hint: def.hint || "",
    map,
    player:   { ...def.player },
    exit:     def.exit ? { ...def.exit } : null,
    door:     def.door ? { ...def.door, locked: def.door.locked ?? true } : null,
    pages:    (def.pages || []).map(p => ({ ...p })),
    terminals:(def.terminals || []).map(t => ({ ...t })),
    puzzleId: def.puzzleId || null,
  };
}

// -------------------------------------------------------------
// Fase 1 — 1 página + 1 terminal + 1 porta + saída
// -------------------------------------------------------------
const LVL1 = buildLevel({
  id: 1,
  title: "Porta desbloqueada! Vá até a saída.",
  hint: "Ache a página (E), resolva o terminal (E) e abra a porta (E).",
  map: [
    "######################",
    "#.............#......#",
    "#..###...###..#..#...#",
    "#..#.......#..#..#...#",
    "#..#...#...#..#..#...#",
    "#..#...#...#..#..#...#",
    "#..#.......#..#..#...#",
    "#..###...###..#..#...#",
    "#....................#",
    "######################",
  ],
  player:   { x: 6,  y: 7 },
  pages:    [{ x: 7,  y: 5 }],
  terminals:[{ x: 13, y: 5 }],
  door:     { x: 18, y: 6, locked: true },
  exit:     { x: 19, y: 6 },
  puzzleId: "parImpar"
});

// -------------------------------------------------------------
// Fase 2 — 1 página + 1 terminal + 1 porta + saída
// -------------------------------------------------------------
const LVL2 = buildLevel({
  id: 2,
  title: "Galeria da Lógica — resolva e avance.",
  hint: "Estude a página. Depois use o terminal para destravar a porta.",
  map: [
    "######################",
    "#...........#........#",
    "#..#####....#...###..#",
    "#..#...#....#.....#..#",
    "#..#...#....#.....#..#",
    "#..#...#....#.....#..#",
    "#..#...#....#####.#..#",
    "#..#...#..........#..#",
    "#..#...##########.#..#",
    "#.................#..#",
    "######################",
  ],
  player:   { x: 3,  y: 9 },
  pages:    [{ x: 6,  y: 5 }],
  terminals:[{ x: 11, y: 5 }],
  door:     { x: 17, y: 7, locked: true },
  exit:     { x: 18, y: 7 },
  puzzleId: "comparadores"
});

export const LEVELS = [LVL1, LVL2];
