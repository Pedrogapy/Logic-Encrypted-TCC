function scr_init_puzzles() {
    // Garante que a inicialização só rode uma vez
    if (variable_global_exists("puzzles_iniciados")) exit;
    global.puzzles_iniciados = true;
    
    global.puzzles = []; // Cada entrada é uma "struct" com dados da fase

    // === Fase 1 ===
    global.puzzles[0] = {
        id: 1,
        title: "Fase 1 - Sequência",
        description: "Complete o laço para incrementar i.",
        code_base: [
            "for (i = 0; i < 10; i++) {",
            "    // ___",
            "}"
        ],
        blanks_expected: 1,
        options_per_blank: [
            ["i++", "i += 1", "++i"]
        ],
        solution: ["i++"],
        concept: "Incremento"
    };

    // === Fase 2 ===
    global.puzzles[1] = {
        id: 2,
        title: "Fase 2 - Condição",
        description: "Escolha o operador correto para a condição.",
        code_base: [
            "if (x ___ 10) {",
            "    abrir_porta();",
            "}"
        ],
        blanks_expected: 1,
        options_per_blank: [
            ["<", ">", "=="]
        ],
        solution: ["<"],
        concept: "Comparação"
    };
    
    // (Adicione as outras 8 fases aqui no mesmo formato)
}