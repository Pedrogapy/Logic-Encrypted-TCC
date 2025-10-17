function scr_save_progress() {
    var _unlocked = [];
    var _completed = [];
    
    for (var i = 0; i < array_length(obj_controle.fases_desbloqueadas); i++) {
        _unlocked[i] = obj_controle.fases_desbloqueadas[i];
    }
    for (var i = 0; i < array_length(obj_controle.fases_concluidas); i++) {
        _completed[i] = obj_controle.fases_concluidas[i];
    }

    var _save_data = {
        unlocked: _unlocked,
        completed: _completed
    };
    
    var _json_string = json_stringify(_save_data);
    
    var _file = file_text_open_write("progress.sav");
    file_text_write_string(_file, _json_string);
    file_text_close(_file);
}