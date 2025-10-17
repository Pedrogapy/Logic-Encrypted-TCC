if (mouse_check_button_pressed(mb_left)) {
    if (mouse_x > x && mouse_x < x + largura &&
        mouse_y > y && mouse_y < y + altura) {
        room_goto(rm_menu); // Troca para a sala do menu
    }
}
