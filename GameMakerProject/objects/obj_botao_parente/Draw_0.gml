// Desenha o botão
var _cor_final = mouse_em_cima ? cor_fundo_hover : cor_fundo_normal;

draw_set_color(_cor_final);
draw_rectangle(x - largura/2, y - altura/2, x + largura/2, y + altura/2, false);

// Desenha o texto
draw_set_font(fnt_main); // Garanta que você tem uma fonte chamada fnt_main
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_color(cor_texto);
draw_text(x, y, texto);

// Reseta o alinhamento
draw_set_halign(fa_left);
draw_set_valign(fa_top);