/*function scr_load_progress() {
    if (file_exists("progress.sav")) {
        var _file = file_text_open_read("progress.sav");
        var _json_string = file_text_read_string(_file);
        file_text_close(_file);
        
        var _load_data = json_parse(_json_string);
        
        if (is_struct(_load_data)) {
            if (variable_struct_exists(_load_data, "unlocked")) {
                obj_controle.fases_desbloqueadas = array_clone(_load_data.unlocked);
            }
            if (variable_struct_exists(_load_data, "completed")) {
                obj_controle.fases_concluidas = array_clone(_load_data.completed);
            }
            show_debug_message("Progresso carregado com sucesso.");
        }
    } else {
        show_debug_message("Nenhum arquivo de save encontrado. Usando progresso padrão.");
    }
}