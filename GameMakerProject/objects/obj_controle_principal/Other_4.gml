// Evento Room Start de obj_controle_principal (VERSÃO DE DIAGNÓSTICO)

show_debug_message("--- Evento Room Start Executado ---");
show_debug_message("A sala atual é: " + room_get_name(room));
show_debug_message("O estado atual do jogo é: " + game_state);

// Se o estado do jogo for 'level_select'...
if (game_state == "level_select") {
    
    show_debug_message("-> CONDIÇÃO VERDADEIRA: O jogo sabe que está na seleção de fases. Criando botões...");
    
    instance_destroy(obj_botao_fase);
    var start_x = 200;
    var start_y = 200;
    var espacamento_x = 150;
    var espacamento_y = 150;
    var colunas = 5;
    for (var i = 0; i < total_fases; i++) {
        var pos_x = start_x + (i mod colunas) * espacamento_x;
        var pos_y = start_y + (i div colunas) * espacamento_y;
        var botao = instance_create_layer(pos_x, pos_y, "Instances", obj_botao_fase);
        botao.fase_num = i + 1;
    }
    
} else {
    show_debug_message("-> CONDIÇÃO FALSA: O jogo NÃO sabe que está na seleção de fases.");
}