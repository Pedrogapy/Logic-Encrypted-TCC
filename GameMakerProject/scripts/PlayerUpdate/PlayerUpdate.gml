// PlayerUpdate (Completo)

function player_update() {
    
    // --- LÓGICA DE MOVIMENTO ---
    var _mov_h = keyboard_check(vk_right) - keyboard_check(vk_left);
    var _mov_v = keyboard_check(vk_down) - keyboard_check(vk_up);
    var _hspd = _mov_h * 4; // Velocidade do jogador
    var _vspd = _mov_v * 4;
    
    if (place_meeting(x + _hspd, y, obj_parede) == false) { x += _hspd; }
    if (place_meeting(x, y + _vspd, obj_parede) == false) { y += _vspd; }

    
    // --- LÓGICA DE INTERAÇÃO COM O TERMINAL ---
    var _terminal_perto = instance_nearest(x, y, obj_terminal);
    
    // Se a tecla E for pressionada perto de um terminal...
    if (keyboard_check_pressed(ord("E")) && _terminal_perto != noone && distance_to_object(_terminal_perto) < 48) {
        
        // ...avisa ao cérebro para carregar a fase e mudar o estado para "puzzle".
        var _controle = obj_controle;
        if (instance_exists(_controle)) {
            _controle.puzzle_fase_atual = _terminal_perto.fase_id;
            // Chama a função para carregar os dados do puzzle
            puzzle_carregar_fase(_terminal_perto.fase_id);
            _controle.estado_do_jogo = "puzzle";
        }
    }
	// --- LÓGICA DE COLETA DE PÁGINAS (ADICIONADA AQUI) ---
    var _pagina_colidida = instance_place(x, y, obj_pagina_conceito);
    
    // Se o jogador colidiu com uma página...
    if (_pagina_colidida != noone) {
        // Acessa o cérebro do jogo
        var _controle = obj_controle;

        // Pega o nome e a descrição da página específica com que colidiu
        var _nome_conceito = _pagina_colidida.meu_conceito_nome;
        var _desc_conceito = _pagina_colidida.meu_conceito_desc;

        // Verifica se o conceito já foi coletado para evitar duplicados
        var _ja_existe = false;
        for (var i = 0; i < array_length(_controle.caderno_conceitos); i++) {
            if (_controle.caderno_conceitos[i] == _nome_conceito) {
                _ja_existe = true;
                break;
            }
        }

        // Se for um novo conceito, adiciona ao caderno
        if (!_ja_existe) {
            array_push(_controle.caderno_conceitos, _nome_conceito);
            _controle.caderno_descricoes[$ _nome_conceito] = _desc_conceito;
        }

        // Destroi a instância da página que foi coletada
        instance_destroy(_pagina_colidida);
    }
}