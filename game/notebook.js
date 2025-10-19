// /game/notebook.js
// Caderno: abre/fecha com "C". Não interfere com "E".

const PAGES = {
  ifelse: {
    title: "Condicionais (if/else)",
    body: `
Use <b>if</b> para tomar decisões.

<code>const temChave = true;

if (temChave) {
  // abre a porta
} else {
  // continua fechada
}</code>

✔ Dica: <code>if (temChave)</code> já é suficiente (não precisa <code>=== true</code>).
`
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

addEventListener("keydown", (e)=>{
  if (e.key.toLowerCase()==="c"){ e.preventDefault(); Notebook.toggle(); }
});
