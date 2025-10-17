// Evento Async - Social do obj_gerenciador_site

// Para postMessage, os dados vêm no campo "message"
if (ds_map_exists(async_load, "message"))
{
    var json_string = async_load[? "message"];
    
    // Tenta converter o texto para um mapa
    var data_map = json_parse(json_string);
    
    // Se a conversão funcionou e a mensagem é do tipo que esperamos...
    if (data_map != -1 && ds_map_exists(data_map, "type") && data_map[? "type"] == "gm_set_progress")
    {
        var nivel_recebido = data_map[? "level"];
        global.ultimo_nivel_concluido = nivel_recebido;
    }
    
    // Limpamos o mapa da memória para evitar vazamentos
    if (data_map != -1) {
        ds_map_destroy(data_map);
    }
}