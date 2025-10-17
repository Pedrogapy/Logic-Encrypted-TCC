// Fechar com ESC
if (keyboard_check_pressed(vk_escape)) {
    instance_destroy();
    exit;
}

// Executar (Ctrl+Enter)
if (keyboard_check(vk_control) && keyboard_check_pressed(vk_enter)) {
    var ok = scr_check_fase1(keyboard_string);
    if (ok) {
        sucesso = true;
        mensagem = "Sucesso! Ordem correta.";

        // Desbloquear Fase 2 (índice 1 no zero-based)
        if (is_array(global.fases_desbloqueadas)) {
            var idx = 1;
            if (idx >= 0 && idx < array_length(global.fases_desbloqueadas)) {
                global.fases_desbloqueadas[idx] = true;
            }
        }
        global.faseConcluida = true;
        global.progressoAtualizado = true;
    } else {
        sucesso = false;
        mensagem = "Ainda não está correto. Verifique a ordem.";
    }
}

// Evitar buffer gigante
if (string_length(keyboard_string) > 4000) {
    keyboard_string = string_copy(keyboard_string, 1, 4000);
}
