// Garante que seja a única instância
if (instance_number(object_index) > 1) {
    instance_destroy();
    exit;
}

// Inicializa TODAS as variáveis de instância
game_state = "menu";
is_paused = false; // <-- A linha que estava faltando ou com erro
total_fases = 10;
font_menu = asset_get_index("fnt_main");
fases_desbloqueadas = array_create(total_fases, false);
fases_desbloqueadas[0] = true;
global.fases_concluidas = array_create(global.total_fases, false);

// --- INICIALIZAÇÃO DE VARIÁVEIS DE INSTÂNCIA ---
game_state = "menu"; // Usando strings para máxima simplicidade
caderno_ativo = false;