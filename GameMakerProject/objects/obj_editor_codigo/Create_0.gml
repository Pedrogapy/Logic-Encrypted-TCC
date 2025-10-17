linha_inicial   = "Digite 'print(chave)' para destrancar a porta:";
texto_digitado  = "";
cursor_visivel  = true;
timer_cursor    = 0;

// Se você vinculou no terminal: ed.ctrl = ctrl;
if (!variable_instance_exists(self, "ctrl")) {
    ctrl = instance_find(obj_fase1_controller, 0);
}

// Bloquear movimento do player (opcional)
with (obj_player) {
    input_travado = true;
}
