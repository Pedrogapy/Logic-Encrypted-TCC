// Use GUI para desenhar interface 2D sem depender de câmera
if (font_exists(fnt)) draw_set_font(fnt);

draw_clear(c_black);

// Título
draw_set_color(c_white);
draw_text(margem, 32, "Fase 1 — Corrija a sequência de comandos (arraste/reordene com as setas).");

// Caixa principal
draw_set_color(cor_caixa);
draw_rectangle(margem, topo_caixa, margem + largura_caixa, topo_caixa + altura_caixa, false);
draw_set_color(cor_borda);
draw_rectangle(margem, topo_caixa, margem + largura_caixa, topo_caixa + altura_caixa, true);

// Desenha linhas com controles ▲ ▼
var y0 = topo_caixa + 12;
for (var i = 0; i < array_length(code_lines); i++) {
    var y0 = y + i * linha_altura;
    var y1 = y0 + linha_altura - 6;

    // fundo da linha (selecionada ou não)
    draw_set_color(i == sel_index ? cor_sel : cor_fundo);
    draw_rectangle(margem + 12, y0, margem + largura_caixa - 12, y1, false);

    // texto
    draw_set_color(cor_texto);
    draw_text(margem + 24, y0 + 8, code_lines[i]);

    // setas (pequenas caixas à direita)
    var seta_x = margem + largura_caixa - 80;
    var seta_w = 24; var seta_h = 24;

    // ▲ (pra cima)
    draw_set_color(c_gray);
    draw_rectangle(seta_x, y0 + 4, seta_x + seta_w, y0 + 4 + seta_h, false);
    draw_set_color(c_white);
    draw_text(seta_x + 6, y0 + 7, "▲");

    // ▼ (pra baixo)
    draw_set_color(c_gray);
    draw_rectangle(seta_x + 32, y0 + 4, seta_x + 32 + seta_w, y0 + 4 + seta_h, false);
    draw_set_color(c_white);
    draw_text(seta_x + 38, y0 + 7, "▼");
}

// Botões
var function draw_btn(btn) {
    draw_set_color(c_dkgray);
    draw_rectangle(btn.x, btn.y, btn.x + btn.w, btn.y + btn.h, false);
    draw_set_color(c_white);
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_text(btn.x + btn.w/2, btn.y + btn.h/2, btn.label);
};
draw_btn(btn_exec);
draw_btn(btn_volt);

// Feedback
draw_set_halign(fa_left);
draw_set_valign(fa_top);
draw_set_color(resultado_cor);
draw_text(margem, room_height - 120, resultado_txt);
