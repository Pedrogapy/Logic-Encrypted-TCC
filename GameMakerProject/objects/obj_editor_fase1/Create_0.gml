// ===== Estado do Editor Fase 1 (Sequência de comandos) =====

// Aparência/GUI
fnt = fnt_mono; // use sua fonte; se não tiver, comente esta linha
margem = 48;
linha_altura = 36;
largura_caixa = room_width - margem*2;
altura_caixa  = 360; // área para listar as linhas
topo_caixa    = 120;

cor_fundo = make_color_rgb(24, 24, 28);
cor_caixa = make_color_rgb(36, 36, 44);
cor_borda = c_gray;
cor_texto = c_ltgray;
cor_sel   = make_color_rgb(70, 90, 140);

// Linhas de "código" (ordem ERRADA proposital)
code_lines = [
    "abrir_porta();",
    "mover_direita(2);",
    "pegar_chave();"
];

// Solução esperada (ordem CORRETA para Fase 1)
solution_lines = [
    "mover_direita(2);",
    "pegar_chave();",
    "abrir_porta();"
];

// Seleção e controle
sel_index = -1;     // nenhuma linha selecionada
resultado_txt = ""; // mensagem de feedback
resultado_cor = c_white;

// Retângulos dos botões
btn_exec = { x: room_width - 220, y: room_height - 90, w: 160, h: 40, label: "Executar" };
btn_volt = { x: room_width - 400, y: room_height - 90, w: 160, h: 40, label: "Voltar"  };

// Desbloqueio (integra com seu controle global)
fase_atual_indice = 0; // Fase 1 -> índice 0 no array global.fases_desbloqueadas
proxima_fase_indice = 1; // Fase 2 -> índice 1

// Segurança: garanta que o array global existe
if (!variable_global_exists("fases_desbloqueadas")) {
    global.total_fases = 10;
    global.fases_desbloqueadas = array_create(global.total_fases, false);
    global.fases_desbloqueadas[0] = true; // libera Fase 1
}
// Função interna para validar a solução (ordem exata)
validar_codigo = function() {
    var ok = true;
    if (array_length(code_lines) != array_length(solution_lines)) ok = false;
    else {
        for (var i = 0; i < array_length(code_lines); i++) {
            if (code_lines[i] != solution_lines[i]) { ok = false; break; }
        }
    }

    if (ok) {
        resultado_txt = "Sucesso! Ordem correta. Próxima fase desbloqueada.";
        resultado_cor = c_lime;
        // desbloqueia próxima fase se existir
        if (proxima_fase_indice < array_length(global.fases_desbloqueadas)) {
            global.fases_desbloqueadas[proxima_fase_indice] = true;
        }
        global.ultima_fase_concluida = 1; // opcional: marcar última fase concluída
    } else {
        resultado_txt = "Ordem incorreta. Reorganize as linhas e tente novamente.";
        resultado_cor = c_red;
    }
};
