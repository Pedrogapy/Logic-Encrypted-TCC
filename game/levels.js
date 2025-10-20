// game/levels.js
// -------------------------------------------------------------
// Definição das fases + utilitário para garantir "clareiras"
// em volta de itens interativos (page / terminal / door / exit),
// evitando que fiquem cercados por paredes, independentemente
// do layout do mapa.
// -------------------------------------------------------------

/**
 * Converte uma grade de strings para matriz numérica (0=livre, 1=parede)
 */
function parseMap(lines) {
  return lines.map(row =>
    row.split('').map(ch => (ch === '#' ? 1 : 0))
  );
}

/**
 * Abre espaço (cross) em volta de (tx,ty) no mapa.
 * radius=1 abre o tile e cruz 4-direções; radius=2 abre um pouco mais.
 */
function carveAround(map, tx, ty, radius = 1) {
  const H = map.length;
  const W = map[0].length;
  const open = (x, y) => {
    if (y >= 0 && y < H && x >= 0 && x < W) map[y][x] = 0;
  };
  open(tx, ty);
  for (let r = 1; r <= radius; r++) {
    open(tx + r, ty);
    open(tx - r, ty);
    open(tx, ty + r);
    open(tx, ty - r);
  }
}

/**
 * Garante "clareiras" ao redor de todos os pontos interativos
 */
function ensureClearings(map, level) {
  const pts = [];

  if (level.player) pts.push(level.player);
  if (level.exit) pts.push(level.exit);
  if (level.door) pts.push(level.door);
  (level.pages || []).forEach(p => pts.push(p));
  (level.terminals || []).forEach(t => pts.push(t));

  // Abre um pequeno cross (radius=1) em volta de cada ponto
  pts.forEach(p => carveAround(map, p.x, p.y, 1));

  // Também abre 1 tile "na frente" da porta (para interagir sem encostar)
  if (level.door && level.exit) {
    const d = level.door;
    // se a saída está à direita, abre à esquerda da porta; e vice-versa
    if (level.exit.x > d.x) carveAround(map, d.x - 1, d.y, 1);
    else carveAround(map, d.x + 1, d.y, 1);
  }
}

/**
 * Constrói o objeto de fase pronto para o engine
 */
export function buildLevel(def) {
  const map = parseMap(def.map);
  ensureClearings(map, def);
  return {
    id: def.id,
    title: def.title,
    hint: def.hint || "",
    map,
    player: { ...def.player },
    exit: def.exit ? { ...def.exit } : null,
    door: def.door ? { ...def.door, locked: def.door.locked ?? true } : null,
    pages: (def.pages || []).map(p => ({ ...p })),
    terminals: (def.terminals || []).map(t => ({ ...t })),
    puzzleId: def.puzzleId || null,
  };
}

// -------------------------------------------------------------
// Fase 1 (tem página + terminal + porta trancada)
// Layout com corredores; os itens NÃO ficam mais bloqueados.
// -------------------------------------------------------------
const LVL1 = buildLevel({
  id: 1,
  title: "Porta desbloqueada! Vá até a saída.",
  hint: "Encontre a página (Caderno), resolva o terminal (E) e a porta abrirá.",
  // # parede / . piso
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
  // posições em coordenadas de grade (tile)
  player:   { x: 4,  y: 7 },
  pages:    [{ x: 6,  y: 4 }],    // UMA página por fase
  terminals:[{ x: 12, y: 4 }],    // um terminal
  door:     { x: 18, y: 6, locked: true },
  exit:     { x: 19, y: 6 },
  puzzleId: "parImpar"
});

// -------------------------------------------------------------
// Fase 2 (um layout diferente, mas idem: 1 página + 1 terminal)
// -------------------------------------------------------------
const LVL2 = buildLevel({
  id: 2,
  title: "Galeria da Lógica — resolva e avance.",
  hint: "Ache a página. Depois use o terminal.",
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
