// Caixa do botão
draw_set_color(c_gray);
draw_rectangle(x, y, x + largura, y + altura, false);

// Texto centralizado
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_color(c_white);
draw_text(x + largura / 2, y + altura / 2, texto);
