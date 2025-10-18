// Conteúdo por “página” coletada
const PAGES = {
  variaveis: {
    title: "Variáveis",
    body: `
Uma <b>variável</b> guarda um valor para usar depois.

<code>let vida = 3;
vida = vida - 1;  // 2</code>`
  },
  condicionais: {
    title: "Condicionais (if/else)",
    body: `
Use <b>if</b> para decidir caminhos.

<code>function podeEntrar(nivel){
  if (nivel >= 2) {
    return "liberado";
  } else {
    return "bloqueado";
  }
}</code>`
  },
  operadores: {
    title: "Operadores (==, %, &&, ||)",
    body: `
Comparações e operações úteis:

<code>// Igualdade
if (porta === "fechada") { /* ... */ }

// Módulo (resto)
const resto = n % 2; // par == 0

// E / Ou
if (temChave && terminalOK) { /* ... */ }
if (temMapa || pista) { /* ... */ }</code>`
  },
  modulo: {
    title: "Módulo (%) e Par/Ímpar",
    body: `
O operador <b>%</b> retorna o resto da divisão. Números pares têm <kbd>n % 2 == 0</kbd>.

<code>function parOuImpar(n){
  return (n % 2 === 0) ? "par" : "ímpar";
}</code>`
  }
};

const modal = document.getElementById("notebook");
const noteContent = document.getElementById("note-content");
const closeBtn = document.getElementById("note-close");

function render(notes){
  const arr = [...notes];
  if (!arr.length){
    noteContent.innerHTML = `<p>Você ainda não coletou nenhuma página. Explore a cripta para encontrar pistas!</p>`;
    return;
  }
  noteContent.innerHTML = arr.map(k=>{
    const p = PAGES[k];
    if (!p) return "";
    return `
      <h3>${p.title}</h3>
      <div class="note-body">${p.body}</div>
    `;
  }).join("<hr/>");
}

export const Notebook = {
  notes: new Set(),
  setNotes(arr){ this.notes = new Set(arr); render(this.notes); },
  addNote(k){ this.notes.add(k); render(this.notes); },
  open(){ modal.classList.add("on"); },
  close(){ modal.classList.remove("on"); },
  toggle(){ modal.classList.toggle("on"); },
};

closeBtn.onclick = ()=>Notebook.close();

// Atalho “C”
addEventListener("keydown", (e)=>{
  if (e.key.toLowerCase()==="c") {
    e.preventDefault();
    Notebook.toggle();
  }
});

// expõe pro jogo
window.PuzzleEngine = {
  openNotebook(notes){ Notebook.setNotes(notes); Notebook.open(); },
  openForLevel(levelId, cb){
    // simples stub: abre notebook e simula puzzle. Você pode plugar um puzzle real depois.
    Notebook.open();
    // Exemplo: para sala 2, exige que o player tenha "condicionais" e "operadores"
    if (levelId===2){
      const ok = Notebook.notes.has("condicionais") && Notebook.notes.has("operadores");
      cb?.({ok});
    } else {
      cb?.({ok:true});
    }
  }
};
