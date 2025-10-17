var mxp = device_mouse_x_to_gui(0);
var myp = device_mouse_y_to_gui(0);

// Clicar em opções -> preenche o próximo slot vazio
for (var i = 0; i < array_length(btns); i++) {
    var bx = btns[i][0], by = btns[i][1], lab = btns[i][2];
    if (mxp >= bx && mxp <= bx + btn_w && myp >= by && myp <= by + btn_h) {
        // encontra primeiro slot vazio
        for (var s = 0; s < array_length(slots); s++) {
            if (slots[s] == "") {
                slots[s] = lab;
                break;
            }
        }
    }
}

// Clicar no texto “LIMPAR” para esvaziar slots
var limpar_x = painel_x + 360;
var limpar_y = painel_y + painel_h - 80;
if (mxp >= limpar_x && mxp <= limpar_x + 120 && myp >= limpar_y-8 && myp <= limpar_y+24) {
    for (var s2 = 0; s2 < array_length(slots); s2++) slots[s2] = "";
}

// Clicar no botão EXECUTAR
var exec_x = painel_x + painel_w - 220;
var exec_y = painel_y + painel_h - 80;
if (mxp >= exec_x && mxp <= exec_x + 180 && myp >= exec_y-8 && myp <= exec_y+40) {
    // Copia slots preenchidos para o controller e valida
    if (ctrl != noone) {
        // monta a sequência do usuário sem vazios
        ctrl.sequencia_usuario = [];
        for (var i2 = 0; i2 < array_length(slots); i2++) {
            if (slots[i2] != "") {
                var len = array_length(ctrl.sequencia_usuario);
                ctrl.sequencia_usuario[len] = slots[i2];
            }
        }
        ctrl.validar_codigo();
    }
}
