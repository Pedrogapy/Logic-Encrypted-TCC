// puzzles.js — fases de lógica com correção de código
export const NOTEBOOK = [
  {
    title: "Condições (if/else)",
    text: `
Condições controlam fluxo com **if (...) { ... } else { ... }**.
Operadores: **> < >= <= == !=** e lógicos **&& (E)**, **|| (OU)**, **! (não)**.

Exemplo:
<code>
function aprovado(nota){
  if (nota >= 6) { return "aprovado"; }
  else { return "recuperacao"; }
}
</code>
`
  },
  {
    title: "Laços (loops)",
    text: `
Laços repetem ações: **for** e **while**.

Exemplo:
<code>
function somaAte(n){
  let s = 0;
  for (let i=1;i<=n;i++){ s += i; }
  return s;
}
</code>
`
  }
];

// Cada fase tem: id (1..N), title, description, starter (com ___ para preencher), tests[]
export const LEVELS = [
  {
    id: 1,
    title: "Maioridade",
    description: "Complete a função para retornar true se a idade for 18 ou mais.",
    starter:
`function maiorDeIdade(idade){
  // use operador >=
  return idade ___ 18;
}`,
    replaceHints: ["<", ">", "==", ">="],
    tests: [
      { inp: [10], out: false },
      { inp: [18], out: true  },
      { inp: [22], out: true  }
    ],
    solution: (idade)=> idade >= 18,
    notebookIndex: 0
  },
  {
    id: 2,
    title: "Par ou Ímpar",
    description: "Retorne 'par' quando n % 2 == 0; caso contrário 'impar'.",
    starter:
`function parOuImpar(n){
  if (n % 2 ___ 0){
    return "par";
  } else {
    return "impar";
  }
}`,
    replaceHints: ["!=", "==", ">", "<="],
    tests: [
      { inp: [2], out: "par"   },
      { inp: [7], out: "impar" },
      { inp: [0], out: "par"   }
    ],
    solution: (n)=> (n%2==0?"par":"impar"),
    notebookIndex: 0
  },
  {
    id: 3,
    title: "Soma até N",
    description: "Implemente um laço que some de 1 até n (inclusive).",
    starter:
`function somaAte(n){
  let s = 0;
  // complete o for
  for (let i = 1; i ___ n; i++){
    s += i;
  }
  return s;
}`,
    replaceHints: ["<", "<=", ">", "=="],
    tests: [
      { inp: [1], out: 1 },
      { inp: [3], out: 6 },
      { inp: [5], out: 15 }
    ],
    // aqui comparamos com a solução de referência:
    solution: (n)=> { let s=0; for(let i=1;i<=n;i++) s+=i; return s; },
    notebookIndex: 1
  }
];

// util: renderiza caderno virtual
export function renderNotebook(container){
  container.innerHTML = "";
  NOTEBOOK.forEach(sec => {
    const h = document.createElement("h4");
    h.textContent = sec.title;
    const p = document.createElement("p");
    p.innerHTML = sec.text.trim();
    container.appendChild(h);
    container.appendChild(p);
  });
}
