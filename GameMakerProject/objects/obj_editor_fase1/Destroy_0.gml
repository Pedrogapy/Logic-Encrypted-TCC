// Limpa o buffer e descongela o player
keyboard_string = "";
if (instance_exists(obj_player)) {
    with (obj_player) {
        if (variable_instance_exists(id, "congelado")) congelado = false;
    }
}
