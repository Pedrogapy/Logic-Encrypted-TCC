var mx = device_mouse_x(0);
var my = device_mouse_y(0);

// 1) Checar clique nos botões
// Executar
if (mx > btn_exec.x && mx < btn_exec.x + btn_exec.w && my > btn_exec.y && my < btn_exec.y + btn_exec.h) {
    validar_codigo();
    exit;
}
// Voltar
if (mx > btn_volt.x && mx < btn_volt.x + btn_volt.w && my > btn_volt.y && my < btn_volt.y + btn_volt.h) {
    room_goto(rm_selecao_fases);
    exit;
}

// 2) Clique numa linha (seleção)
var y_inicio = topo_caixa + 12;
for (var i = 0; i < array_length(code_lines); i++) {
    var y0 = y_inicio + i * linha_altura;
    var y1 = y0 + linha_altura - 6;

    if (mx > margem + 12 && mx < margem + largura_caixa - 12 && my > y0 && my < y1) {
        sel_index = i;

        // Checar se clicou nas setas
        var seta_x = margem + largura_caixa - 80;
        var seta_w = 24; var seta_h = 24;

        // ▲
        if (mx > seta_x && mx < seta_x + seta_w && my > y0 + 4 && my < y0 + 4 + seta_h) {
            // mover para cima
            if (sel_index > 0) {
                var tmp = code_lines[sel_index - 1];
                code_lines[sel_index - 1] = code_lines[sel_index];
                code_lines[sel_index] = tmp;
                sel_index -= 1;
            }
            exit;
        }
        // ▼
        if (mx > seta_x + 32 && mx < seta_x + 32 + seta_w && my > y0 + 4 && my < y0 + 4 + seta_h) {
            // mover para baixo
            if (sel_index < array_length(code_lines) - 1) {
                var tmp2 = code_lines[sel_index + 1];
                code_lines[sel_index + 1] = code_lines[sel_index];
                code_lines[sel_index] = tmp2;
                sel_index += 1;
            }
            exit;
        }

        // Selecionou a linha (sem setas)
        resultado_txt = ""; // limpa feedback ao selecionar
        exit;
    }
}
