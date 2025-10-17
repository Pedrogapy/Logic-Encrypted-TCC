var tentativa = string_replace_all(texto_digitado, " ", "");

// Validação do enigma da Fase 1
if (tentativa == "print(chave)") {
    // Destranca a porta pelo controller
    if (instance_exists(ctrl)) {
        ctrl.porta_destrancada = true;
        ctrl.editor_ativo = false;
    }
    // Libera o player
    with (obj_player) { input_travado = false; }

    instance_destroy(); // fecha editor
} else {
    // Feedback simples na HUD
    show_debug_message("Código incorreto. Tente novamente.");
    texto_digitado = "";
}
