// scr_get_input
// Este script verifica o input do jogador uma vez por frame usando o método mais básico.

function scr_get_input() {
    // Verifica a tecla de interação 'E' usando ord() com letra maiúscula
    global.key_interact_pressed = keyboard_check_pressed(ord("E"));

    // Verifica a tecla do caderno 'C' usando ord() com letra maiúscula
    global.key_caderno_pressed = keyboard_check_pressed(ord("C"));
}