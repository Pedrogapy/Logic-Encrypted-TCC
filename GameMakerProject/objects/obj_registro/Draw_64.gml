draw_set_font(fnt_main);
draw_set_halign(fa_center);
draw_set_valign(fa_middle);

var _w = display_get_gui_width();
var _h = display_get_gui_height();

// Desenha o campo de email
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 150, _h/2 - 60, _w/2 + 150, _h/2 - 30, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 - 45, input_email);

// Desenha o campo de senha
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 150, _h/2 - 10, _w/2 + 150, _h/2 + 20, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 + 5, string_repeat("*", string_length(input_senha)));

// Desenha o campo de confirmar senha
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 150, _h/2 + 40, _w/2 + 150, _h/2 + 70, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 + 55, string_repeat("*", string_length(input_confirmar_senha)));

// Desenha o botão "Registrar"
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 75, _h/2 + 90, _w/2 + 75, _h/2 + 120, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 + 105, "Registrar");

// Desenha o botão "Voltar"
draw_set_color(c_dkgray);
draw_rectangle(_w/2 - 75, _h/2 + 140, _w/2 + 75, _h/2 + 170, false);
draw_set_color(c_white);
draw_text(_w/2, _h/2 + 155, "Voltar");

// Desenha a mensagem de feedback
draw_set_color(c_red);
draw_text(_w/2, _h/2 + 200, mensagem_feedback);