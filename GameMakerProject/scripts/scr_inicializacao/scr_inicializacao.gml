// scr_inicializacao
function inicializar_jogo() {
    
    // Garante que a inicialização só rode uma vez
    if (variable_global_exists("jogo_iniciado")) exit;
    global.jogo_iniciado = true;
    
    // --- SEUS DADOS DO PUZZLE ---
    global.puzzles = [];
    
    // === Fase 1 ===
    global.puzzles[0] = {
        id: 1,
        title: "Fase 1 - Sequência",
        // ... (resto dos dados da fase 1) ...
        concept: "Incremento"
    };
    
    // === Fase 2 ===
    global.puzzles[1] = {
        id: 2,
        title: "Fase 2 - Condição",
        // ... (resto dos dados da fase 2) ...
        concept: "Comparação"
    };
    
    // (Continue com as outras fases aqui)
}