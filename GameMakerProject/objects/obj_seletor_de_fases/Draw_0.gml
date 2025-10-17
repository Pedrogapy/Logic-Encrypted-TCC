// Loop através de cada instância de botão para desenhá-la
with (obj_botao_fase) {
    var _fase_index = fase_num - 1;
    var _is_desbloqueada = other.fases_desbloqueadas[_fase_index];
    var _sprite = _is_desbloqueada ? spr_fase_unlock : spr_fase_lock;
    draw_sprite(_sprite, 0, x, y);
    draw_set_font(fnt_main);
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_set_color(_is_desbloqueada ? c_white : c_gray);
    draw_text(x + 32, y + 32, string(fase_num));
}

// Desenha o botão "Voltar"
var _gui_w = display_get_gui_width();
var _gui_h = display_get_gui_height();
draw_set_halign(fa_center);
draw_set_valign(fa_middle);
draw_set_color($3C3C3C); // Cinza escuro

// CORREÇÃO: Os valores de Y foram alterados para mover o botão para cima.
draw_rectangle(_gui_w/2 - 100, _gui_h - 120, _gui_w/2 + 100, _gui_h - 70, false);
draw_set_color(c_white);
draw_text(_gui_w/2, _gui_h - 95, "Voltar");

// Reseta as configurações de desenho
draw_set_halign(fa_left);
draw_set_valign(fa_top);