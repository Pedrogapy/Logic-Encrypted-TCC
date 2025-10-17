// Dentro do Evento de Colisão do obj_player com o obj_porta

// 1. Defina qual nível foi concluído
// (Para isso funcionar, precisamos que cada room saiba qual nível ela é. Veja a dica abaixo)
var nivel_concluido = nivel_atual;

// 2. Chame a função do site para salvar o progresso
//show_debug_message("Colisão com a porta da fase " + string(nivel_concluido) + "! Salvando progresso...");
//browser_execute_js("salvarProgresso(" + string(nivel_concluido) + ");");

// 3. Avance para a próxima fase
// (Se você já tinha um código para ir para a próxima fase, coloque-o aqui)
room_goto_next();