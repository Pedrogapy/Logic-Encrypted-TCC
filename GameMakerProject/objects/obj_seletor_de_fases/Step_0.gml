var _mouse_x = mouse_x;
var _mouse_y = mouse_y;
var _clique = mouse_check_button_pressed(mb_left);

if (_clique) {
    // Verifica o clique em cada um dos botões de fase
    with (obj_botao_fase) {
        if (point_in_rectangle(_mouse_x, _mouse_y, x, y, x + 64, y + 64)) {
            var _fase_index = fase_num - 1;
            if (other.fases_desbloqueadas[_fase_index] == true) {
                var _nome_sala = "rm_fase" + string(fase_num) + "_cenario";
                if (room_exists(asset_get_index(_nome_sala))) {
                    room_goto(asset_get_index(_nome_sala));
                }
            }
            break;
        }
    }
    
    // Verifica o clique no botão "Voltar"
    var _gui_w = display_get_gui_width();
    var _gui_h = display_get_gui_height();
    
    // CORREÇÃO: Os valores de Y foram alterados para mover o botão para cima.
    if (point_in_rectangle(_mouse_x, _mouse_y, _gui_w/2 - 100, _gui_h - 120, _gui_w/2 + 100, _gui_h - 70)) {
        room_goto(rm_menu);
    }
}