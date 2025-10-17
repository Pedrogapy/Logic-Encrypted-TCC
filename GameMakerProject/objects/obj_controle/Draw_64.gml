draw_set_font(fonte_principal);

// --- MÁQUINA DE ESTADOS VISUAL ---
switch (estado_do_jogo) {
    
    case "menu_principal":
        draw_set_halign(fa_center);
        draw_set_valign(fa_middle);
        var _w = display_get_gui_width();
        var _h = display_get_gui_height();
        draw_set_color(c_dkgray);
        draw_rectangle(_w/2 - 100, _h/2 - 25, _w/2 + 100, _h/2 + 25, false);
        draw_set_color(c_white);
        draw_text(_w/2, _h/2, "Iniciar Jogo");
    break;
    
    case "selecao_fases":
        var _colunas = 5;
        var _start_x = 200;
        var _start_y = 200;
        var _espacamento_x = 150;
        var _espacamento_y = 150;
        for (var i = 0; i < total_fases; i++) {
            var _xx = _start_x + (i mod _colunas) * _espacamento_x;
            var _yy = _start_y + (i div _colunas) * _espacamento_y;
            var _is_desbloqueada = fases_desbloqueadas[i];
            
            var sprite = _is_desbloqueada ? spr_fase_unlock : spr_fase_lock;
            draw_sprite(sprite, 0, _xx, _yy);
            
            draw_set_halign(fa_center);
            draw_set_valign(fa_middle);
            draw_set_color(_is_desbloqueada ? c_white : c_gray);
            draw_text(_xx + 32, _yy + 32, string(i + 1));
        }
        var _gui_w = display_get_gui_width();
        var _gui_h = display_get_gui_height();
        draw_set_halign(fa_center);
        draw_set_valign(fa_middle);
        draw_set_color(c_dkgray);
        draw_rectangle(_gui_w/2 - 100, _gui_h - 80, _gui_w/2 + 100, _gui_h - 30, false);
        draw_set_color(c_white);
        draw_text(_gui_w/2, _gui_h - 55, "Voltar");
    break;

    case "em_jogo":
        // Se o caderno estiver ativo, desenha a interface dele por cima do jogo
        if (caderno_ativo) {
            draw_set_alpha(0.8);
            draw_rectangle_color(0, 0, display_get_gui_width(), display_get_gui_height(), c_black, c_black, c_black, c_black, false);
            draw_set_alpha(1.0);
            var _cx = display_get_gui_width() / 2;
            var _cy = display_get_gui_height() / 2;
            draw_set_color(make_color_rgb(240, 230, 210));
            draw_rectangle(_cx - 350, _cy - 225, _cx + 350, _cy + 225, false);
            draw_set_halign(fa_left);
            draw_set_valign(fa_top);
            draw_set_font(fonte_principal);
            draw_set_color(c_black);
            draw_text(_cx - 350 + 20, _cy - 225 + 20, "Indice:");
            var _lista_conceitos = caderno_conceitos;
            for (var i = 0; i < array_length(_lista_conceitos); i++) {
                var _nome_conceito = _lista_conceitos[i];
                var _yy = _cy - 225 + 60 + (i * 30);
                if (_nome_conceito == caderno_conceito_selecionado) { draw_set_color(c_blue); } else { draw_set_color(c_black); }
                draw_text(_cx - 350 + 30, _yy, "- " + _nome_conceito);
            }
            draw_set_color(c_dkgray);
            draw_line(_cx, _cy - 225 + 10, _cx, _cy + 225 - 10);
            if (caderno_conceito_selecionado != "" && variable_struct_exists(caderno_descricoes, caderno_conceito_selecionado)) {
                var _desc = caderno_descricoes[$ caderno_conceito_selecionado];
                draw_set_color(c_black);
                draw_text_ext(_cx + 20, _cy - 225 + 20, _desc, 24, 350 - 40);
            }
        }
    break;
        
    case "puzzle":
        draw_set_alpha(0.9);
        draw_rectangle_color(0, 0, display_get_gui_width(), display_get_gui_height(), c_black, c_black, c_black, c_black, false);
        draw_set_alpha(1.0);
        draw_set_halign(fa_left);
        draw_set_valign(fa_top);
        draw_set_color(c_white);
        draw_text(48, 32, puzzle_cfg.title);
        if (variable_struct_exists(puzzle_cfg, "objetivo")) {
            draw_set_color(c_aqua);
            draw_text(48, 64, puzzle_cfg.objetivo);
        }
        var _main_box_w = display_get_gui_width() - 350 - 48;
        draw_set_color(make_color_rgb(36, 36, 44));
        draw_rectangle(48, 120, 48 + _main_box_w, 120 + 360, false);
        var y0 = 120 + 12;
        if (puzzle_cfg.mode == EditorMode.BLANKS) {
            for (var i = 0; i < array_length(puzzle_cfg.prompt); i++) {
                var line = puzzle_cfg.prompt[i];
                if (is_array(puzzle_blanks_filled)) {
                    for (var k = 0; k < array_length(puzzle_blanks_filled); k++) {
                        var token = "%" + string(k + 1);
                        var val = (puzzle_blanks_filled[k] == "") ? "___" : puzzle_blanks_filled[k];
                        line = string_replace_all(line, token, val);
                    }
                }
                draw_set_color(c_ltgray);
                draw_text(48 + 24, y0 + i * 36, line);
            }
            draw_set_color(c_white);
            draw_text(48, 120 + 360 + 16, "Lacuna: " + string(puzzle_sel_blank + 1) + "/" + string(array_length(puzzle_cfg.blanks_expected)));
            var opts = puzzle_cfg.options_per_blank[puzzle_sel_blank];
            for (var o = 0; o < array_length(opts); o++) {
                var b = { x: 48 + (120 + 12) * o, y: 120 + 360 + 40, w: 120, h: 32, label: opts[o] };
                puzzle_draw_button(b);
            }
			// --- CÓDIGO DE DESENHO DA NAVEGAÇÃO (ADICIONADO AQUI) ---
	        // Desenha os botões de navegação se houver mais de uma lacuna
	        if (array_length(puzzle_cfg.blanks_expected) > 1) {
	            var _nav_y = 120 + 360 + 80;
	            var btn_lacuna_prev = { x: 48, y: _nav_y, w: 120, h: 32, label: "< Lacuna" };
	            var btn_lacuna_next = { x: 48 + 132, y: _nav_y, w: 120, h: 32, label: "Lacuna >" };
	            puzzle_draw_button(btn_lacuna_prev);
	            puzzle_draw_button(btn_lacuna_next);
	        }
        }
        if (puzzle_cfg.mode == EditorMode.REORDER) {
            for (var i = 0; i < array_length(puzzle_code_lines); i++) {
                var color = (i == puzzle_sel_blank) ? c_yellow : c_ltgray;
                draw_set_color(color);
                draw_text(48 + 24, y0 + i * 36, puzzle_code_lines[i]);
            }
        }
        var _gui_width = display_get_gui_width();
        var _terminal_w = 272;
        var _terminal_h = 180;
        var _margin = 48;
        var _terminal_x = _gui_width - _terminal_w - _margin;
        var _terminal_y = 120;
        draw_set_color(make_color_rgb(10, 15, 10));
        draw_rectangle(_terminal_x, _terminal_y, _terminal_x + _terminal_w, _terminal_y + _terminal_h, false);
        draw_set_color(c_green);
        draw_rectangle(_terminal_x, _terminal_y, _terminal_x + _terminal_w, _terminal_y + _terminal_h, true);
        draw_set_color(puzzle_resultado_cor);
        draw_text_ext(_terminal_x + 50, _terminal_y + 50, puzzle_resultado_txt, 20, _terminal_w - 20);
        puzzle_draw_button(ui_btn_volt);
        puzzle_draw_button(ui_btn_exec);
    break;
}

// --- MONITOR VISUAL (Adicionado no final para aparecer por cima de tudo) ---
draw_set_halign(fa_left);
draw_set_valign(fa_top);
draw_set_color(c_white);

var texto_debug = "DEBUG: global.ultimo_nivel_concluido NÃO EXISTE";
if (variable_global_exists("ultimo_nivel_concluido"))
{
    texto_debug = "DEBUG: Valor de global.ultimo_nivel_concluido: " + string(global.ultimo_nivel_concluido);
}

// Desenha o valor da variável no topo da tela para depuração
draw_text(10, 50, texto_debug);


// Reseta as configurações de desenho no final
draw_set_halign(fa_left);
draw_set_valign(fa_top);