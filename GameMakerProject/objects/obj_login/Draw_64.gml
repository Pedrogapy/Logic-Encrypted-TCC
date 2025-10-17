draw_set_font(fnt_main); // Garanta que a fonte 'fnt_main' exista
draw_set_halign(fa_center);
draw_set_valign(fa_middle);

var _w = display_get_gui_width();
var _h = display_get_gui_height();

// Desenha o campo de email
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 150, _h/2 - 40, _w/2 + 150, _h/2 - 10, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 - 25, input_email);

// Desenha o campo de senha
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 150, _h/2 + 10, _w/2 + 150, _h/2 + 40, false);
draw_set_color(c_white);
// Desenha asteriscos em vez da senha real
var _senha_mascarada = string_repeat("*", string_length(input_senha));
draw_text(_w/2, _h/2 + 25, _senha_mascarada);

// Desenha o botão "Entrar"
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 75, _h/2 + 60, _w/2 + 75, _h/2 + 90, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 + 75, "Entrar");

// Desenha a mensagem de feedback (erro)
draw_set_color(c_red);
draw_text(_w/2, _h/2 + 120, mensagem_feedback);