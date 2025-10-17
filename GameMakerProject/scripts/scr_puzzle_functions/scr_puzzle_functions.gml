// scr_puzzle_functions: Funções que gerenciam a lógica do puzzle.

function puzzle_carregar_fase(_numero_fase) {
    var _controle = obj_controle; // Acessa o cérebro do jogo
    
    _controle.puzzle_fase_atual = _numero_fase;
    _controle.puzzle_cfg = scr_editor_config(_numero_fase);

    // Reseta as variáveis do puzzle com base no modo
    if (_controle.puzzle_cfg.mode == EditorMode.REORDER) {
		// CORREÇÃO: Substituímos array_clone por um loop manual para copiar a lista
        _controle.puzzle_code_lines = [];
        for (var i = 0; i < array_length(_controle.puzzle_cfg.lines); i++) {
            _controle.puzzle_code_lines[i] = _controle.puzzle_cfg.lines[i];
        }
        array_shuffle(_controle.puzzle_code_lines);
        
    } 
    else if (_controle.puzzle_cfg.mode == EditorMode.BLANKS) {
        _controle.puzzle_blanks_filled = array_create(array_length(_controle.puzzle_cfg.blanks_expected), "");
        _controle.puzzle_sel_blank = 0;
    }
    
    _controle.puzzle_resultado_txt = "";
    _controle.estado_do_jogo = "puzzle"; // Ativa o estado de "puzzle"
}

function puzzle_draw_button(_btn) {
    // Função auxiliar para desenhar botões do puzzle
    draw_set_color(c_dkgray);
    draw_rectangle(_btn.x, _btn.y, _btn.x + _btn.w, _btn.y + _btn.h, false);
    draw_set_color(c_white);
    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);
    draw_text(_btn.x + _btn.w / 2, _btn.y + _btn.h / 2, _btn.label);
}