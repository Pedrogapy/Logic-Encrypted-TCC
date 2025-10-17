// scr_draw_button(struct_do_botao)
// Desenha um botão simples na tela com base em um struct.

function scr_draw_button(_btn) {
    // Desenha a caixa do botão
    draw_set_color(c_dkgray);
    draw_rectangle(_btn.x, _btn.y, _btn.x + _btn.w, _btn.y + _btn.h, false);

    // Desenha o texto do botão no centro
    draw_set_color(c_white);
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_text(_btn.x + _btn.w / 2, _btn.y + _btn.h / 2, _btn.label);

    // Reseta o alinhamento para evitar problemas em outros desenhos
    draw_set_halign(fa_left);
    draw_set_valign(fa_top);
}