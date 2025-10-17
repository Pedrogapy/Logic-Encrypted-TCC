// scr_caderno_registrar(lista_de_conceitos, anotacao)
// Adiciona novos conceitos e anotações ao caderno global.
function scr_caderno_registrar(_conceitos, _anotacao) {

    // Adiciona a anotação na lista
    array_push(global.caderno_anotacoes, _anotacao);

    // Adiciona apenas os conceitos que ainda não estão no caderno
    for (var i = 0; i < array_length(_conceitos); i++) {
        var conceito = _conceitos[i];
        
        // Verifica se o conceito já existe para não duplicar
        var existe = false;
        for (var j = 0; j < array_length(global.caderno_conceitos); j++) {
            if (global.caderno_conceitos[j] == conceito) {
                existe = true;
                break;
            }
        }
        
        // Se não existe, adiciona
        if (!existe) {
            array_push(global.caderno_conceitos, conceito);
        }
    }
}