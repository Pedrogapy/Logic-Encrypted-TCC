// game/levels.js
// -----------------------------------------------------------------------------
// Esquema dos níveis usado pelo motor atual:
//
// export const LEVELS = [
//   {
//     id: Number,
//     title: String,
//     width: Number, height: Number,   // canvas interno do jogo
//     tile: 32,                         // grade (opcional, ajuda a alinhar)
//     spawn: { x, y },                  // onde o jogador nasce
//     exit:  { x, y, w, h },            // zona de saída (após porta abrir)
//     door:  { x, y, w, h, locked: true },
//     terminal: { x, y, w, h, levelId },// 'E' abre puzzle do levelId
//     pages: [{ x, y, key }],           // 1 página por fase (chave bate com notebook.js)
//     walls: [{ x, y, w, h }],          // retângulos sólidos
//     lights: [{ x, y, r }]             // efeito visual
//   },
//   ...
// ]
//
// Observações:
// - Fase 1 tem 1 página: key = "ifelse" (caderno -> Condicionais).
// - Fase 2 tem 1 página: key = "modulo" (caderno -> Módulo %).
// - O terminal SEMPRE chama o puzzle passando o id do nível (levelId).
// - A porta só abre quando o puzzle é resolvido (pelo puzzle.js).
// -----------------------------------------------------------------------------

export const TILE = 32;

export const LEVELS = [
  // ---------------------------------------------------------------------------
  // FASE 1 — Condicionais (if/else)
  // Layout: sala retangular simples, uma página de estudo e um terminal.
  // Objetivo: resolver puzzle de if/else para abrir a porta e sair.
  // ---------------------------------------------------------------------------
  {
    id: 1,
    title: "Galeria — Introdução",
    width: 960,
    height: 540,
    tile: TILE,

    // jogador nasce perto do canto esquerdo
    spawn: { x: 120, y: 420 },

    // saída fica atrás da porta (lado direito)
    exit:  { x: 900, y: 420, w: 28, h: 80 },

    // porta no corredor direito
    door:  { x: 880, y: 392, w: 24, h: 120, locked: true },

    // terminal próximo da porta (pressione E)
    terminal: { x: 820, y: 420, w: 24, h: 24, levelId: 1 },

    // *** UMA página por fase ***
    pages: [
      // Página sobre if/else (coleta com toque/colisão)
      { x: 260, y: 420, key: "ifelse" }
    ],

    // paredes (retângulos) — sala externa + alguns pilares
    walls: [
      // moldura externa
      { x: 60,  y: 360, w: 800, h: 24 }, // teto
      { x: 60,  y: 504, w: 820, h: 24 }, // chão
      { x: 60,  y: 360, w: 24,  h: 168 }, // esquerda
      { x: 856, y: 360, w: 24,  h: 168 }, // direita (antes da porta)

      // pilares internos (obstáculos simples)
      { x: 360, y: 416, w: 40, h: 88 },
      { x: 520, y: 416, w: 40, h: 88 },
      { x: 680, y: 416, w: 40, h: 88 },
    ],

    // luzes decorativas (efeito visual)
    lights: [
      { x: 220, y: 380, r: 95 },
      { x: 500, y: 380, r: 100 },
      { x: 780, y: 380, r: 95 },
    ],
  },

  // ---------------------------------------------------------------------------
  // FASE 2 — Par/Ímpar com operador % (módulo)
  // Layout: sala com corredores verticais. 1 página e um terminal.
  // Objetivo: resolver puzzle de par/ímpar para abrir a porta e sair.
  // ---------------------------------------------------------------------------
  {
    id: 2,
    title: "Galeria da Lógica",
    width: 960,
    height: 540,
    tile: TILE,

    spawn: { x: 120, y: 420 },
    exit:  { x: 900, y: 420, w: 28, h: 80 },

    door:  { x: 880, y: 392, w: 24, h: 120, locked: true },
    terminal: { x: 820, y: 420, w: 24, h: 24, levelId: 2 },

    // *** UMA página por fase ***
    pages: [
      // Página sobre módulo % (par/ímpar)
      { x: 440, y: 300, key: "modulo" }
    ],

    // moldura + “colunas” verticais no meio
    walls: [
      // moldura
      { x: 60,  y: 360, w: 800, h: 24 },
      { x: 60,  y: 504, w: 820, h: 24 },
      { x: 60,  y: 360, w: 24,  h: 168 },
      { x: 856, y: 360, w: 24,  h: 168 },

      // colunas verticais
      { x: 340, y: 380, w: 40, h: 110 },
      { x: 480, y: 380, w: 40, h: 160 },
      { x: 620, y: 380, w: 40, h: 120 },
      { x: 740, y: 380, w: 40, h: 140 },
    ],

    lights: [
      { x: 240, y: 380, r: 95 },
      { x: 480, y: 360, r: 90 },
      { x: 720, y: 380, r: 95 },
      { x: 860, y: 380, r: 85 },
    ],
  },
];

// utilidades simples (opcional)
export function findLevelById(id){
  return LEVELS.find(l => l.id === id) || LEVELS[0];
}

export function nextLevelId(currentId){
  const i = LEVELS.findIndex(l => l.id === currentId);
  return (i >= 0 && i < LEVELS.length - 1) ? LEVELS[i+1].id : LEVELS[0].id;
}
