// game/levels.js
// -------------------------------------------------------------
// Fases + utilitários para impedir que itens fiquem presos
// e para garantir um caminho do jogador até cada interação.
// -------------------------------------------------------------

/** Converte linhas de mapa (#=parede, .=piso) para 0/1 */
function parseMap(lines) {
  return lines.map(row => row.split("").map(ch => (ch === "#" ? 1 : 0)));
}

/** Limites */
function inBounds(map, x, y) {
  const H = map.length;
  const W = map[0].length;
  return y >= 0 && y < H && x >= 0 && x < W;
}

/** Abre (seta 0) um tile se existir */
function open(map, x, y) {
  if (inBounds(map, x, y)) map[y][x] = 0;
}

/** Abre uma clareira (tile + cruz ao redor) */
function carveAround(map, x, y, radius = 1) {
  open(map, x, y);
  for (let r = 1; r <= radius; r++) {
    open(map, x + r, y);
    open(map, x - r, y);
    open(map, x, y + r);
    open(map, x, y - r);
  }
}

/** Abre um "corredor Manhattan" (x->y) do (x0,y0) ao (x1,y1) */
function carveCorridor(map, x0, y0, x1, y1) {
  let x = x0, y = y0;
  // anda no X
  const sx = x1 > x ? 1 : -1;
  while (x !== x1) {
    x += sx;
    open(map, x, y);
    // “folga” nas laterais
    open(map, x, y - 1);
    open(map, x, y + 1);
  }
  // anda no Y
  const sy = y1 > y ? 1 : -1;
  while (y !== y1) {
    y += sy;
    open(map, x, y);
    open(map, x - 1, y);
    open(map, x + 1, y);
  }
}

/** BFS rápido: verifica se há caminho passável (4-direções) */
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

/** Abre clareiras em volta de todos os pontos interativos */
function ensureClearings(map, level) {
  const pts = [];
  if (level.player)   pts.push(level.player);
  if (level.exit)     pts.push(level.exit);
  if (level.door)     pts.push(level.door);
  (level.pages || []).forEach(p => pts.push(p));
  (level.terminals || []).forEach(t => pts.push(t));

  // abre o próprio tile + cruz ao redor
  pts.forEach(p => carveAround(map, p.x, p.y, 1));

  // garante espaço "em frente" da porta
  if (level.door && level.exit) {
    const d = level.door;
    if (level.exit.x > d.x) carveAround(map, d.x - 1, d.y, 1);
    else                    carveAround(map, d.x + 1, d.y, 1);
  }
}

/** Garante conectividade do player a todos os pontos interativos */
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
  }
}

/** Constrói uma fase pronta pro engine */
export function buildLevel(def) {
  const map = parseMap(def.map);

  // abre os tiles dos itens e arredores
  ensureClearings(map, def);
  // garante caminho do jogador até página/terminal/porta/saída
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
// (coordenadas pensadas pra ficarem visíveis no seu layout)
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
  player:   { x: 4,  y: 7 },
  pages:    [{ x: 6,  y: 4 }],
  terminals:[{ x: 12, y: 4 }],
  door:     { x: 18, y: 6, locked: true },
  exit:     { x: 19, y: 6 },
  puzzleId: "parImpar"
});

// -------------------------------------------------------------
// Fase 2 — idem (uma página e um terminal)
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
  player:   { x: 2,  y: 9 },
  pages:    [{ x: 5,  y: 5 }],
  terminals:[{ x: 10, y: 5 }],
  door:     { x: 17, y: 7, locked: true },
  exit:     { x: 18, y: 7 },
  puzzleId: "comparadores"
});

export const LEVELS = [LVL1, LVL2];
