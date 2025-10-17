// Evento Step de obj_botao_parente

// CORREÇÃO: Usa as coordenadas do mouse no MUNDO DO JOGO (mouse_x/mouse_y)
// para comparar com as coordenadas do botão no MUNDO DO JOGO (x/y).
var _mouse_x_room = mouse_x;
var _mouse_y_room = mouse_y;

// Verifica se o mouse está sobre a área do botão
if (point_in_rectangle(_mouse_x_room, _mouse_y_room, x - largura/2, y - altura/2, x + largura/2, y + altura/2)) {
    mouse_em_cima = true;
    
    // Se o mouse for clicado...
    if (mouse_check_button_pressed(mb_left)) {
        // ...executa a função 'onClick' que foi definida pelo filho.
        onClick();
    }
    
} else {
    mouse_em_cima = false;
}