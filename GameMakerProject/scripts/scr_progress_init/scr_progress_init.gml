// scr_progress_init(total_de_fases)
// Inicializa o sistema de progresso do jogador.
function scr_progress_init(_total_fases) {

    // Só inicializa se a variável ainda não existir
    if (!variable_global_exists("fases_desbloqueadas")) {
        global.fases_desbloqueadas = array_create(_total_fases, false);
        global.fases_desbloqueadas[0] = true; // Desbloqueia a primeira fase
    }

    if (!variable_global_exists("caderno_conceitos")) {
        global.caderno_conceitos = [];
    }
    
    if (!variable_global_exists("caderno_anotacoes")) {
        global.caderno_anotacoes = [];
    }
}