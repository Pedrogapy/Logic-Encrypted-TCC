// puzzles.js — fases de lógica associadas às salas
export const NOTEBOOK = {
  ifelse: {
    title: "Condições (if/else)",
    html: `
<p>Use <code>if (condicao) { ... } else { ... }</code>.
Operadores: <code>&gt; &lt; &gt;= &lt;= == !=</code> e lógicos <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>.</p>
<pre><code>function aprovado(nota){
  if (nota >= 6) return "aprovado";
  else return "recuperacao";
}</code></pre>`
  },
  modulo: {
    title: "Módulo (%) e Par/Ímpar",
    html: `
<p>O operador <code>%</code> retorna o resto da divisão. Números pares têm <code>n % 2 == 0</code>.</p>
<pre><code>function parOuImpar(n){
  return (n % 2 == 0) ? "par" : "impar";
}</code></pre>`
  },
  loops: {
    title: "Laços (for)",
    html: `
<p>Some 1..n com <code>for</code>:</p>
<pre><code>function somaAte(n){
  let s=0;
  for (let i=1;i<=n;i++) s+=i;
  return s;
}</code></pre>`
  }
};

// puzzle por sala (id → spec)
export const PUZZLES = {
  1: {
    title: "Maioridade",
    desc: "Retorne true se a idade for 18 ou mais.",
    starter:
`function maiorDeIdade(idade){
  // complete usando >=
  return idade ___ 18;
}`,
    hints: [">=", "==", "<=", "<", ">"],
    tests: [
      { inp:[10], out:false },
      { inp:[18], out:true  },
      { inp:[21], out:true  }
    ],
    solution: (idade)=> idade >= 18
  },
  2: {
    title: "Par ou Ímpar",
    desc: "Retorne 'par' quando n % 2 == 0; senão 'impar'.",
    starter:
`function parOuImpar(n){
  if (n % 2 ___ 0){
    return "par";
  } else {
    return "impar";
  }
}`,
    hints: ["==","!=","<",">"],
    tests: [
      { inp:[2], out:"par" },
      { inp:[7], out:"impar" },
      { inp:[0], out:"par" }
    ],
    solution: (n)=> (n%2==0?"par":"impar")
  },
  3: {
    title: "Soma até N",
    desc: "Implemente o for para somar de 1 a n.",
    starter:
`function somaAte(n){
  let s=0;
  for (let i=1; i ___ n; i++){
    s += i;
  }
  return s;
}`,
    hints: ["<=","<",">","=="],
    tests: [
      { inp:[1], out:1 },
      { inp:[3], out:6 },
      { inp:[5], out:15 }
    ],
    solution: (n)=>{ let s=0; for(let i=1;i<=n;i++) s+=i; return s; }
  }
};
// game/puzzles.js
// -------------------------------------------------------------
// Define o conteúdo do caderno e a validação de cada puzzle.
// ui.openPuzzle(puzzleId) vai usar "validators[puzzleId]".
// Page usa "notebookContent[puzzleId]".
// -------------------------------------------------------------

export const notebookContent = {
  parImpar: [
`Módulo (%) e Par/Ímpar

O operador % retorna o resto da divisão.
Números pares têm (n % 2) == 0.

Exemplo:
function parOuImpar(n) {
  return (n % 2 === 0) ? "par" : "ímpar";
}`],
  comparadores: [
`Condicionais (if/else) e comparadores

==  igualdade (valor)
=== igualdade (valor e tipo)
!=  diferente
>   maior que   <   menor que
>=  maior ou igual   <= menor ou igual

Exemplo de decisão:
if (nivel >= 2) {
  // libera acesso
} else {
  // bloqueia
}`]
};

export const validators = {
  // nível 1: pergunta simples de par/ímpar
  parImpar: async (ui) => {
    const nStr = await ui.prompt("Digite um número inteiro. A porta abre se for PAR:");
    const n = Number(nStr);
    if (!Number.isInteger(n)) return false;
    return (n % 2 === 0);
  },

  // nível 2: comparadores / if
  comparadores: async (ui) => {
    const nvStr = await ui.prompt("Você encontrou o valor do nível. Digite um número >= 2 para liberar:");
    const nv = Number(nvStr);
    if (!Number.isFinite(nv)) return false;
    return nv >= 2;
  }
};
