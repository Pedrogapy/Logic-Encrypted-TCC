// Evento Create de obj_botao_sair
event_inherited(); // Herda todas as variáveis do pai

texto = "Sair do Jogo";

// Define a ação específica deste botão
onClick = function() {
    game_end();
}