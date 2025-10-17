// Evento Step do obj_porta (Versão Final e Completa)

// Controle do sprite da porta
if (aberta) {
    sprite_index = spr_porta_aberta;
} else {
    sprite_index = spr_porta_fechada;
}

// Lógica de colisão que roda apenas UMA VEZ
if (aberta == true && place_meeting(x, y, obj_player) && colisao_ativada == false) {

    colisao_ativada = true;

    // NOVO MÉTODO: Descobrindo o nível a partir do nome da room
	var room_name = room_get_name(room); // Pega o nome da sala atual (ex: "rm_fase1_cenario")
	var nivel_string = string_digits(room_name); // Pega apenas os dígitos do nome (ex: "1")
	var nivel_concluido = real(nivel_string); // Converte o texto "1" para o número 1

    // NOVO MÉTODO: Mudamos a 'hash' (#) da URL para passar a informação
    var url_hash = "#save_level_" + string(nivel_concluido);
    url_open_ext(url_hash, "_self");

    // O código para mudar de fase continua normal
    var proxima_fase = fase_id + 1;
    var nome_proxima_sala = "rm_fase" + string(proxima_fase) + "_cenario";

    if (room_exists(asset_get_index(nome_proxima_sala))) {
        obj_controle.estado_do_jogo = "em_jogo";
        room_goto(asset_get_index(nome_proxima_sala));
    } else {
        obj_controle.estado_do_jogo = "selecao_fases";
        room_goto(rm_selecao_fases);
    }
}