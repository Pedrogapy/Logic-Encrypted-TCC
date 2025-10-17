// --- INPUT ---
var _mouse_x = device_mouse_x_to_gui(0);
var _mouse_y = device_mouse_y_to_gui(0);
var _click = mouse_check_button_pressed(mb_left);
var _key_esc = keyboard_check_pressed(vk_escape);

// --- LÓGICA DE PAUSA ---
if (_key_esc) { is_paused = !is_paused; }

// --- LÓGICA DO JOGO ---
if (!is_paused) {
    // Lógica do Menu Principal
    if (game_state == "menu" && _click) {
        var _w = display_get_gui_width();
        var _h = display_get_gui_height();
        if (point_in_rectangle(_mouse_x, _mouse_y, _w/2 - 100, _h/2 - 25, _w/2 + 100, _h/2 + 25)) {
            game_state = "level_select";
            room_goto(rm_selecao_fases);
        }
    }

    // Lógica da Seleção de Fases
    if (game_state == "level_select" && _click) {
        with (obj_botao_fase) {
            if (point_in_rectangle(_mouse_x, _mouse_y, x, y, x + 64, y + 64)) {
                var fase_index = fase_num - 1;
                if (GAME().fases_desbloqueadas[fase_index]) {
                    var nome_sala = "rm_fase" + string(fase_num) + "_cenario";
                    if (room_exists(asset_get_index(nome_sala))) {
                        room_goto(asset_get_index(nome_sala));
                    }
                }
                break;
            }
        }
        var _w = display_get_gui_width();
        var _h = display_get_gui_height();
        if (point_in_rectangle(_mouse_x, _mouse_y, _w/2 - 100, _h - 80, _w/2 + 100, _h - 30)) {
            game_state = "menu";
            room_goto(rm_menu);
        }
    }
} else {
    // Lógica do menu de pausa
}