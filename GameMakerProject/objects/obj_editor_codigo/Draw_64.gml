var gw = display_get_gui_width();
var gh = display_get_gui_height();

// Fundo cinza translúcido
draw_set_alpha(0.8);
draw_set_color(make_colour_rgb(64,64,64));
draw_rectangle(0,0,gw,gh,false);
draw_set_alpha(1);

// Terminal
draw_set_color(c_black);
draw_rectangle(50, 50, gw - 50, gh - 150, false);

// Texto
draw_set_color(c_white);
draw_set_halign(fa_left);
draw_set_valign(fa_top);

var texto_final = linha_inicial + "\n> " + texto_digitado;
draw_text(60, 60, texto_final);

// Cursor
if (cursor_visivel) {
    draw_text(60 + string_width("> " + texto_digitado), 76, "|");
}
