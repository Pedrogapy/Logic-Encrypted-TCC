// Define o conteúdo das fases: geometria, props e conteúdo do caderno/puzzle

export const LEVELS = [
  // Index 0 é Fase 1
  {
    id: 1,
    title: "Sala 1: Introdução ao Módulo (%)",
    width: 1024, height: 560,
    walls: [
      // borda
      {x:40,y:360,w:940,h:20}, {x:40,y:180,w:20,h:200}, {x:960,y:180,w:20,h:200}, {x:60,y:180,w:900,h:20},
      // pilares
      {x: 300,y:220,w:40,h:140}, {x: 580,y:220,w:40,h:140}, {x: 820,y:220,w:40,h:140},
    ],
    spawn: {x:80,y:330,w:18,h:18},
    door:  {x: 980, y: 300, w: 20, h: 80},
    page:  {x: 220, y: 320, w: 14, h: 14},
    terminal: {x: 900, y: 330, w: 16, h: 16},
    notebook: `
<h4>Módulo (%) e Par/Ímpar</h4>
<p>O operador <code>%</code> retorna o <b>resto</b> de uma divisão. Números pares têm <code>n % 2 == 0</code>.</p>
<div class="code">function parOuImpar(n){
  return (n % 2 === 0) ? "par" : "impar";
}</div>
`,
    puzzle: {
      type: "input",
      prompt: "Se n = 7, quanto vale n % 2 ?",
      placeholder: "Digite um número...",
      check: (txt) => String(txt).trim() === "1",
      success: "Correto! A porta foi desbloqueada.",
      fail: "Resposta incorreta. Lembre: 7 dividido por 2 tem resto 1."
    }
  },

  // Index 1 é Fase 2
  {
    id: 2,
    title: "Sala 2: Condicionais (if/else)",
    width: 1024, height: 560,
    walls: [
      // borda
      {x:40,y:360,w:940,h:20}, {x:40,y:180,w:20,h:200}, {x:960,y:180,w:20,h:200}, {x:60,y:180,w:900,h:20},
      // obstáculos
      {x:320,y:220,w:30,h:140},
      {x:520,y:220,w:30,h:140},
      {x:720,y:220,w:30,h:140},
    ],
    spawn: {x:90,y:330,w:18,h:18},
    door:  {x: 980, y: 300, w: 20, h: 80},
    page:  {x: 420, y: 330, w: 14, h: 14}, // UMA página apenas
    terminal: {x: 880, y: 330, w: 16, h: 16},
    notebook: `
<h4>Condicionais (if/else)</h4>
<p>Use <code>if</code> para tomar decisões. Exemplo:</p>
<div class="code">function podeEntrar(nivel){
  if (nivel &gt;= 2) {
    return "liberado";
  } else {
    return "bloqueado";
  }
}</div>
<p>Também é comum comparar com <code>===</code> e combinar com <code>&amp;&amp;</code> / <code>||</code>.</p>
`,
    puzzle: {
      type: "choices",
      prompt: "Qual condição abre a porta somente se nivel for maior ou igual a 2?",
      options: [
        "nivel = 2",
        "nivel > 2",
        "nivel >= 2",
        "nivel <= 2"
      ],
      correctIndex: 2,
      success: "Perfeito! A porta foi desbloqueada.",
      fail: "Não é essa. Tente pensar: a partir de 2 já pode abrir."
    }
  },
];
