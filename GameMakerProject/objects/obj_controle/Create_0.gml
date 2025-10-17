// Evento Create de obj_controle
inicializar_jogo();
// Garante que apenas UMA instância deste objeto exista no jogo (Singleton)
if (instance_number(object_index) > 1) {
    instance_destroy();
    exit;
}
persistent = true; // Garante que ele sobreviva entre as salas
// --- VARIÁVEIS DE ESTADO DO JOGO ---
// Todas as variáveis agora são de instância, não globais.
estado_do_jogo = "menu_principal"; // Controla qual tela/lógica está ativa

// --- CONFIGURAÇÕES E DADOS ---
fonte_principal = asset_get_index("fnt_main");
total_fases = 10;
fases_desbloqueadas = array_create(total_fases, false);
fases_desbloqueadas[0] = true; // Fase 1 sempre desbloqueada
fases_concluidas = array_create(total_fases, false);
caderno_conceitos = [];
caderno_descricoes = {};

// --- VARIÁVEIS DE PUZZLE E CADERNO ---
puzzle_ativo = false;
caderno_ativo = false;
puzzle_fase_atual = -1;
puzzle_sel_blank = 0;
puzzle_cfg = {};
puzzle_blanks_filled = [];
puzzle_resultado_txt = "";
puzzle_resultado_cor = c_white;
puzzle_code_lines = [];
caderno_conceito_selecionado = "";

// Definição dos botões do puzzle (serão atualizados no Room Start)
ui_btn_exec = { x: room_width - 220, y: room_height - 90, w: 160, h: 40, label: "Executar" };
ui_btn_volt = { x: 48, y: room_height - 90, w: 160, h: 40, label: "Voltar" };

// --- SIMULAÇÃO DE BANCO DE DADOS DE USUÁRIOS ---
database_users = {}; // Um struct para guardar todos os usuários
current_user_id = noone; // Nenhum usuário logado no início

// --- CARREGAMENTO DO PROGRESSO DO USUÁRIO ---
// Chama a função para carregar os dados específicos do usuário que fez login
//carregar_progresso_do_usuario();
// No final do Evento Create do obj_controle
scr_load_progress();