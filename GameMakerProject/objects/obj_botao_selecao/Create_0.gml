// Evento Create de obj_botao_selecao
event_inherited(); // Herda todas as variáveis do pai

texto = "Selecao de Fases";

// Define a ação específica deste botão
onClick = function() {
    room_goto(rm_selecao_fases);
}