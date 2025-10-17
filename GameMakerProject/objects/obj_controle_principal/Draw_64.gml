// Evento Draw GUI de obj_controle_principal

draw_set_font(font);

// --- DESENHO DA INTERFACE (SÓ EXECUTA SE NÃO ESTIVER PAUSADO) ---
if (!is_paused) {

    // Se estamos na sala do menu, desenha o menu principal
    if (game_state == "menu") {
        draw_set_halign(fa_center);
        draw_set_valign(fa_middle);
        var _w = display_get_gui_width();
        var _h = display_get_gui_height();
        draw_set_color(c_dkgray);
        draw_rectangle(_w/2 - 100, _h/2 - 25, _w/2 + 100, _h/2 + 25, false);
        draw_set_color(c_white);
        draw_text(_w/2, _h/2, "Iniciar Jogo");
    }
    
    // Se estamos na sala de seleção de fases, desenha os botões
    if (game_state == "level_select") {
        // Loop através de cada instância de botão de fase para desenhá-la
        with (obj_botao_fase) {
            var _fase_index = fase_num - 1;
            var _is_desbloqueada = GAME().fases_desbloqueadas[_fase_index];
            
            // Define a aparência com base no estado (travado/destravado)
            var _sprite = _is_desbloqueada ? spr_fase_unlock : spr_fase_lock;
            draw_sprite(_sprite, 0, x, y);
            
            // Desenha o número da fase no centro do botão
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
        draw_set_color(c_dkgray);
        draw_rectangle(_gui_w/2 - 100, _gui_h - 80, _gui_w/2 + 100, _gui_h - 30, false);
        draw_set_color(c_white);
        draw_text(_gui_w/2, _gui_h - 55, "Voltar");
    }
}

// --- DESENHO DO MENU DE PAUSA ---
if (is_paused) {
    // ... (código do menu de pausa)
}

// Reseta as configurações de desenho
draw_set_halign(fa_left);
draw_set_valign(fa_top);