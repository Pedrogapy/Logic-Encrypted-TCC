// levels.js — salas da cripta (grid de 32px)
// Legenda: '#' = parede, 'S' = spawn do jogador, '.' piso
// Objetos são definidos em "objects": Door/Terminal/PageNote/EnemyPatrol

import { TILE, Tilemap } from "./core.js";
import { Player, Door, Terminal, PageNote, EnemyPatrol } from "./entities.js";

export const LEVELS = [
  {
    id:1,
    name:"Corredor Inicial",
    grid:[
      "############################",
      "#S.................#.......#",
      "#........###.......#.......#",
      "#........#.#.......#.......#",
      "#........#.#...............#",
      "#........#.#.......#..T....#",
      "#........###.......#.......#",
      "#..................#...D...#",
      "############################",
    ],
    objects:[
      { name:"Door", x:TILE*23, y:TILE*7, dir:"v" },
      { name:"Terminal", x:TILE*20, y:TILE*5, puzzleId:1 },
      { name:"PageNote", x:TILE*6,  y:TILE*1, note:"ifelse" }
    ],
    enemies:[]
  },
  {
    id:2,
    name:"Galeria com Patrulha",
    grid:[
      "############################",
      "#S.............###.........#",
      "#..............#.#........#",
      "#..........T...#.#........#",
      "#..............#.#........#",
      "#..............###........#",
      "#..........................#",
      "#...............D..........#",
      "############################",
    ],
    objects:[
      { name:"Door", x:TILE*15, y:TILE*7, dir:"h" },
      { name:"Terminal", x:TILE*12, y:TILE*3, puzzleId:2 },
      { name:"PageNote", x:TILE*3,  y:TILE*1, note:"modulo" }
    ],
    enemies:[
      { x:TILE*8, y:TILE*6, path:[{x:TILE*8,y:TILE*2},{x:TILE*20,y:TILE*6}] }
    ]
  },
  {
    id:3,
    name:"Câmara do Somatório",
    grid:[
      "############################",
      "#S...............########..#",
      "#................#......#..#",
      "#.........T......#......#..#",
      "#................#......#..#",
      "#................########..#",
      "#..........................#",
      "#......................D...#",
      "############################",
    ],
    objects:[
      { name:"Door", x:TILE*22, y:TILE*7, dir:"v" },
      { name:"Terminal", x:TILE*9,  y:TILE*3, puzzleId:3 },
      { name:"PageNote", x:TILE*2,  y:TILE*6, note:"loops" }
    ],
    enemies:[
      { x:TILE*18, y:TILE*2, path:[{x:TILE*18,y:TILE*2},{x:TILE*18,y:TILE*6}] }
    ]
  }
];

export function buildLevel(def){
  const map = new Tilemap(def.grid);
  let spawn = { x:TILE*1+4, y:TILE*1+4 };
  for (let y=0;y<def.grid.length;y++){
    for (let x=0;x<def.grid[y].length;x++){
      if (def.grid[y][x] === "S") spawn = { x:x*TILE+4, y:y*TILE+4 };
    }
  }
  const entities = [];
  (def.objects||[]).forEach(o=>{
    if (o.name==="Door"){ const d = new Door(o.x,o.y,o.dir||"v"); entities.push(d); }
    if (o.name==="Terminal"){ entities.push(new Terminal(o.x,o.y,o.puzzleId)); }
    if (o.name==="PageNote"){ entities.push(new PageNote(o.x,o.y,o.note)); }
  });
  (def.enemies||[]).forEach(e=>{
    entities.push(new EnemyPatrol(e.x, e.y, e.path||[{x:e.x,y:e.y}], e.speed||1.6));
  });
  const player = new Player(spawn.x, spawn.y);
  return { map, entities, player, id:def.id, name:def.name };
}
