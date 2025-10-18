// Conteúdo enxuto — cada sala tem 1 página
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
  const arr = [...notes];
  if (!arr.length){
    noteContent.innerHTML = `<p>Você ainda não coletou a página desta sala. Explore para encontrar!</p>`;
    return;
  }
  noteContent.innerHTML = arr.map(k=>{
    const p = PAGES[k]; if (!p) return "";
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

addEventListener("keydown", (e)=>{
  if (e.key.toLowerCase()==="c") {
    e.preventDefault();
    Notebook.toggle();
  }
});

window.PuzzleEngine = {
  openNotebook(notes){ Notebook.setNotes(notes); Notebook.open(); },

  // cada sala exige sua própria página
  openForLevel(levelId, cb){
    if (levelId===1){
      cb?.({ok:true}); // tutorial/introdução — sem checagem
      return;
    }
    if (levelId===2){
      const ok = Notebook.notes.has("modulo");
      cb?.({ok});
      return;
    }
    cb?.({ok:true});
  }
};
