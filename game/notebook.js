// /game/notebook.js
// Caderno simples: só abre/fecha com "C". Nada de abrir com "E".

const PAGES = {
  variaveis: {
    title: "Variáveis (introdução)",
    body: `
Uma variável guarda um valor para usar depois.

<code>let chaves = 0;  // começa sem chaves
chaves = chaves + 1; // agora tenho 1</code>`
  },
  modulo: {
    title: "Módulo (%) — Par/Ímpar",
    body: `
O operador <b>%</b> devolve o resto da divisão.  
Se <kbd>n % 2 === 0</kbd>, o número é <b>par</b>.

<code>function ehPar(n){
  return (n % 2 === 0);
}</code>`
  }
};

const modal = document.getElementById("notebook");
const noteContent = document.getElementById("note-content");
const closeBtn = document.getElementById("note-close");

function render(notes){
  const list = [...notes];
  if (!list.length){
    noteContent.innerHTML = `<p>Você ainda não coletou a página desta sala. Explore para encontrar!</p>`;
    return;
  }
  noteContent.innerHTML = list.map(k=>{
    const p = PAGES[k]; if(!p) return "";
    return `<h3>${p.title}</h3><div class="note-body">${p.body}</div>`;
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

// Atalho: somente "C" controla o caderno
addEventListener("keydown", (e)=>{
  if (e.key.toLowerCase()==="c"){ e.preventDefault(); Notebook.toggle(); }
});

// Exposto pro puzzle/terminal (não abre caderno automaticamente)
window.PuzzleEngine = {
  openForLevel(levelId, cb){
    if (levelId === 1){ cb?.({ok:true}); return; }
    if (levelId === 2){ cb?.({ok: Notebook.notes.has("modulo")}); return; }
    cb?.({ok:true});
  }
};
