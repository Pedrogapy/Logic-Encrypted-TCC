// game/entities.js
// ------------------------------------------------------------------
// Entidades base (Player, Page, Terminal, Door, Exit)
// A porta agora é INTERATIVA: só abre se o puzzle da fase for
// resolvido no Terminal (game.levelState.doorOpen = true).
// ------------------------------------------------------------------

export class Entity {
  constructor(x, y) {
    this.x = x; // em tiles
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.solid = false; // colisão bloqueia?
    this.interactive = false; // aparece dica "E"
    this.type = "entity";
  }

  update(dt, game) {}
  draw(ctx, tileSize, theme) {
    // padrão: nada
  }

  overlapsPlayer(px, py) {
    return Math.abs(px - this.x) < 1 && Math.abs(py - this.y) < 1;
  }
}

export class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.type = "player";
    this.speed = 6; // tiles/seg
  }

  update(dt, game) {
    const k = game.input;
    let vx = 0;
    let vy = 0;
    if (k.left)  vx -= 1;
    if (k.right) vx += 1;
    if (k.up)    vy -= 1;
    if (k.down)  vy += 1;
    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    const nx = this.x + vx * this.speed * dt;
    const ny = this.y + vy * this.speed * dt;

    // colisão grade simples
    if (!game.isWallAt(nx, this.y)) this.x = nx;
    if (!game.isWallAt(this.x, ny)) this.y = ny;
  }

  draw(ctx, tile, theme) {
    ctx.fillStyle = theme.player;
    ctx.fillRect(this.x * tile, this.y * tile, tile, tile);
  }
}

export class Page extends Entity {
  constructor(x, y, textBlocks = []) {
    super(x, y);
    this.type = "page";
    this.interactive = true;
    this.textBlocks = textBlocks;
  }

  onInteract(game) {
    // abre caderno com os blocos desta fase
    game.ui.openNotebook(this.textBlocks);
  }

  draw(ctx, tile, theme) {
    ctx.fillStyle = theme.page;
    ctx.fillRect(this.x * tile + tile*0.15, this.y * tile + tile*0.15, tile*0.7, tile*0.7);
  }
}

export class Terminal extends Entity {
  constructor(x, y, puzzleId) {
    super(x, y);
    this.type = "terminal";
    this.interactive = true;
    this.puzzleId = puzzleId;
  }

  async onInteract(game) {
    // abre puzzle; se resolver, marca porta aberta
    const ok = await game.ui.openPuzzle(this.puzzleId);
    if (ok) {
      game.levelState.doorOpen = true;
      game.ui.toast("Porta destravada!");
    } else {
      game.ui.toast("Resposta incorreta. Tente novamente.");
    }
  }

  draw(ctx, tile, theme) {
    ctx.fillStyle = theme.terminal;
    ctx.fillRect(this.x * tile + tile*0.1, this.y * tile + tile*0.1, tile*0.8, tile*0.8);
  }
}

export class Door extends Entity {
  constructor(x, y, initiallyLocked = true) {
    super(x, y);
    this.type = "door";
    this.solid = true;         // bloqueia a passagem enquanto trancada
    this.interactive = true;   // pode apertar E perto da porta
    this.locked = initiallyLocked;
    this.opened = false;
  }

  tryOpen(game) {
    // Só abre se o puzzle foi resolvido
    if (game.levelState.doorOpen) {
      this.locked = false;
      this.opened = true;
      this.solid = false;
      game.ui.toast("A porta abriu!");
    } else {
      game.ui.toast("Resolva o terminal para destravar a porta.");
    }
  }

  onInteract(game) {
    if (!this.opened) this.tryOpen(game);
  }

  draw(ctx, tile, theme) {
    if (this.opened) {
      // porta aberta (marcada como “luz verde”)
      ctx.fillStyle = theme.doorOpen;
      ctx.fillRect(this.x * tile + tile*0.35, this.y * tile, tile*0.3, tile);
      return;
    }
    // Porta fechada (bloco vertical)
    ctx.fillStyle = this.locked ? theme.doorLocked : theme.doorOpen;
    ctx.fillRect(this.x * tile + tile*0.25, this.y * tile, tile*0.5, tile);
  }
}

export class Exit extends Entity {
  constructor(x, y) {
    super(x, y);
    this.type = "exit";
  }

  update(dt, game) {
    // se player está dentro, termina fase
    const px = game.player.x;
    const py = game.player.y;
    if (Math.hypot(px - this.x, py - this.y) < 0.6) {
      game.finishLevel();
    }
  }

  draw(ctx, tile, theme) {
    ctx.fillStyle = theme.exit;
    ctx.fillRect(this.x * tile + tile*0.2, this.y * tile + tile*0.2, tile*0.6, tile*0.6);
  }
}

/**
 * Fabrica entidades a partir da definição do nível
 */
export function spawnEntities(game, levelDef, notebookContentByPuzzle) {
  const ents = [];

  // Player
  game.player = new Player(levelDef.player.x, levelDef.player.y);
  ents.push(game.player);

  // Page (uma por fase)
  if (levelDef.pages?.length) {
    // conteúdo do caderno vem do puzzleId da fase
    const content = notebookContentByPuzzle[levelDef.puzzleId] || [];
    const p = levelDef.pages[0];
    ents.push(new Page(p.x, p.y, content));
  }

  // Terminal
  if (levelDef.terminals?.length) {
    const t = levelDef.terminals[0];
    ents.push(new Terminal(t.x, t.y, levelDef.puzzleId));
  }

  // Door
  if (levelDef.door) {
    ents.push(new Door(levelDef.door.x, levelDef.door.y, levelDef.door.locked));
  }

  // Exit
  if (levelDef.exit) ents.push(new Exit(levelDef.exit.x, levelDef.exit.y));

  return ents;
}
