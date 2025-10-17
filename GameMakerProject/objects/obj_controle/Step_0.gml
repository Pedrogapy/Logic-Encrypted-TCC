// --- 1. LEITURA DE INPUTS ---
var _mouse_x = device_mouse_x_to_gui(0);
var _mouse_y = device_mouse_y_to_gui(0);
var _clique = mouse_check_button_pressed(mb_left);
var _tecla_caderno = keyboard_check_pressed(ord("C"));
// --- 2. MÁQUINA DE ESTADOS LÓGICA ---
switch (estado_do_jogo) {
    
    case "menu_principal":
        if (_clique) {
            var _gui_w = display_get_gui_width();
            var _gui_h = display_get_gui_height();
            if (point_in_rectangle(_mouse_x, _mouse_y, _gui_w/2 - 100, _gui_h/2 - 25, _gui_w/2 + 100, _gui_h/2 + 25)) {
                estado_do_jogo = "selecao_fases";
                room_goto(rm_selecao_fases);
            }
        }
    break;
    
    case "selecao_fases":

	    /// Primeiro, garantimos que a Fase 1 (índice 0 do array) está SEMPRE desbloqueada.
	    /*fases_desbloqueadas[0] = true;

	    // Agora, verificamos se o progresso do Firebase já chegou e é maior que 0.
	    if (variable_global_exists("ultimo_nivel_concluido") && global.ultimo_nivel_concluido > 0) {
        
	        // Se sim, usamos um loop para desbloquear as outras fases.
	        for (var i = 1; i <= global.ultimo_nivel_concluido; i++) {
	            if (i < total_fases) {
	               fases_desbloqueadas[i] = true;
	            }
	        }
	    }
		*/
		// A gente só executa a lógica de desbloqueio se o progresso já foi carregado (diferente de -1)
	    // Versão 1: Apenas a fase 1 (índice 0) está desbloqueada.
	    fases_desbloqueadas[0] = true;
	    for (var i = 1; i < total_fases; i++) {
	        fases_desbloqueadas[i] = false;
	    }
	    // ... continue para todas as 10 fases
	    // O seu código original para verificar o clique continua aqui, sem alterações
	    if (_clique) {
	        var _colunas = 5;
	        var _start_x = 200;
	        var _start_y = 200;
	        var _espacamento_x = 150;
	        var _espacamento_y = 150;
	        for (var i = 0; i < total_fases; i++) {
	            var _xx = _start_x + (i mod _colunas) * _espacamento_x;
	            var _yy = _start_y + (i div _colunas) * _espacamento_y;
	            if (point_in_rectangle(_mouse_x, _mouse_y, _xx, _yy, _xx + 64, _yy + 64)) {
	                if (fases_desbloqueadas[i]) {
	                    estado_do_jogo = "em_jogo";
	                    room_goto(asset_get_index("rm_fase" + string(i + 1) + "_cenario"));
	                }
	                break;
	            }
	        }
	        var _gui_w = display_get_gui_width();
	        var _gui_h = display_get_gui_height();
	        if (point_in_rectangle(_mouse_x, _mouse_y, _gui_w/2 - 100, _gui_h - 80, _gui_w/2 + 100, _gui_h - 30)) {
	            estado_do_jogo = "menu_principal";
	            room_goto(rm_menu);
	        }
	    }
	break;

    case "em_jogo":
		// --- LÓGICA DO CADERNO (ADICIONADA AQUI) ---
        if (_tecla_caderno && !puzzle_ativo) {
            caderno_ativo = !caderno_ativo; // Abre ou fecha o caderno
        }
        
        // Se o caderno estiver ativo, verifica cliques nos conceitos
        if (caderno_ativo && _clique) {
            var _cx = display_get_gui_width() / 2;
            var _cy = display_get_gui_height() / 2;
            for (var i = 0; i < array_length(caderno_conceitos); i++) {
                var _nome_conceito = caderno_conceitos[i];
                var _xx = _cx - 350 + 30;
                var _yy = _cy - 225 + 60 + (i * 30);
                if (point_in_rectangle(_mouse_x, _mouse_y, _xx, _yy, _cx, _yy + 25)) {
                    caderno_conceito_selecionado = _nome_conceito;
                    break;
                }
            }
        }
        if (instance_exists(obj_player)) {
            with (obj_player) {
                player_update();
            }
        }
    break;
        
    case "puzzle":
	var _inside = function(btn) { return (_mouse_x > btn.x && _mouse_x < btn.x + btn.w && _mouse_y > btn.y && _mouse_y < btn.y + btn.h); };

        if (_clique) {
            // CORREÇÃO: Usamos point_in_rectangle em vez da função '_inside'

            // Lógica para o botão Voltar
            if (point_in_rectangle(_mouse_x, _mouse_y, ui_btn_volt.x, ui_btn_volt.y, ui_btn_volt.x + ui_btn_volt.w, ui_btn_volt.y + ui_btn_volt.h)) {
                estado_do_jogo = "em_jogo";
            }
            
            // Lógica para o botão Executar
            if (point_in_rectangle(_mouse_x, _mouse_y, ui_btn_exec.x, ui_btn_exec.y, ui_btn_exec.x + ui_btn_exec.w, ui_btn_exec.y + ui_btn_exec.h)) {
                var _sucesso = false;
                if (puzzle_cfg.mode == EditorMode.BLANKS) {
                    _sucesso = array_equals(puzzle_blanks_filled, puzzle_cfg.blanks_expected);
                }
                else if (puzzle_cfg.mode == EditorMode.REORDER) {
                    _sucesso = array_equals(puzzle_code_lines, puzzle_cfg.solution);
                }
                
                if (_sucesso) {
                    puzzle_resultado_txt = "Sucesso!";
                    fases_concluidas[puzzle_fase_atual - 1] = true;
                    if (puzzle_fase_atual < total_fases) {
                        fases_desbloqueadas[puzzle_fase_atual] = true;
                    }
					if (instance_exists(obj_porta)) {
                        obj_porta.aberta = true;
                    }
                } else {
                    puzzle_resultado_txt = "Incorreto.";
                }
            }
            
            // Lógica para os botões de opção das lacunas
            // Lógica para os botões de opção das lacunas
            if (puzzle_cfg.mode == EditorMode.BLANKS) {
                var opts = puzzle_cfg.options_per_blank[puzzle_sel_blank];
                for (var o = 0; o < array_length(opts); o++) {
                    var b = { x: 48 + (120 + 12) * o, y: 120 + 360 + 40, w: 120, h: 32, label: opts[o] };
                    if (point_in_rectangle(_mouse_x, _mouse_y, b.x, b.y, b.x + b.w, b.y + b.h)) {
                        puzzle_blanks_filled[puzzle_sel_blank] = b.label;
                        puzzle_resultado_txt = "";
                        break;
                    }
                }

                // --- ADICIONADO AQUI: LÓGICA DE CLIQUE NA NAVEGAÇÃO DE LACUNA ---
                if (array_length(puzzle_cfg.blanks_expected) > 1) {
                    var _nav_y = 120 + 360 + 80;
                    var btn_lacuna_prev = { x: 48, y: _nav_y, w: 120, h: 32, label: "< Lacuna" };
                    var btn_lacuna_next = { x: 48 + 132, y: _nav_y, w: 120, h: 32, label: "Lacuna >" };

                    if (point_in_rectangle(_mouse_x, _mouse_y, btn_lacuna_prev.x, btn_lacuna_prev.y, btn_lacuna_prev.x + btn_lacuna_prev.w, btn_lacuna_prev.y + btn_lacuna_prev.h)) {
                        puzzle_sel_blank = max(0, puzzle_sel_blank - 1);
                    }
                    if (point_in_rectangle(_mouse_x, _mouse_y, btn_lacuna_next.x, btn_lacuna_next.y, btn_lacuna_next.x + btn_lacuna_next.w, btn_lacuna_next.y + btn_lacuna_next.h)) {
                        puzzle_sel_blank = min(array_length(puzzle_cfg.blanks_expected) - 1, puzzle_sel_blank + 1);
                    }
                }
            }
			
			if (puzzle_cfg.mode == EditorMode.REORDER) {
                var y0 = 120 + 12;
                for (var i = 0; i < array_length(puzzle_code_lines); i++) {
                    var _yy = y0 + i * 36;
                    // Se o clique for em cima de uma linha de código, seleciona-a
                    if (point_in_rectangle(_mouse_x, _mouse_y, 48, _yy, room_width - 48, _yy + 35)) {
                        puzzle_sel_blank = i;
                        break;
                    }
                }
            }
			
        }
		// --- LÓGICA DE TECLADO PARA MODO REORDER (ADICIONADA) ---
        if (puzzle_cfg.mode == EditorMode.REORDER) {
            var _key_up = keyboard_check_pressed(vk_up);
            var _key_down = keyboard_check_pressed(vk_down);
            
            // Move a linha selecionada para cima
            if (_key_up && puzzle_sel_blank > 0) {
                var _temp = puzzle_code_lines[puzzle_sel_blank];
                puzzle_code_lines[puzzle_sel_blank] = puzzle_code_lines[puzzle_sel_blank - 1];
                puzzle_code_lines[puzzle_sel_blank - 1] = _temp;
                puzzle_sel_blank--;
            }
            
            // Move a linha selecionada para baixo
            if (_key_down && puzzle_sel_blank < array_length(puzzle_code_lines) - 1) {
                var _temp = puzzle_code_lines[puzzle_sel_blank];
                puzzle_code_lines[puzzle_sel_blank] = puzzle_code_lines[puzzle_sel_blank + 1];
                puzzle_code_lines[puzzle_sel_blank + 1] = _temp;
                puzzle_sel_blank++;
            }
		}
		
    break;
}