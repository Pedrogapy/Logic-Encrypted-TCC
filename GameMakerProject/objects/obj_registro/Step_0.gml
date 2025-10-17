var _clique = mouse_check_button_pressed(mb_left);

if (_clique) {
    var _w = display_get_gui_width();
    var _h = display_get_gui_height();
    
    // Área de clique para o campo de email
    if (point_in_rectangle(mouse_x, mouse_y, _w/2 - 150, _h/2 - 60, _w/2 + 150, _h/2 - 30)) {
        input_email = get_string("Digite seu email:", input_email);
    }
    
    // Área de clique para o campo de senha
    if (point_in_rectangle(mouse_x, mouse_y, _w/2 - 150, _h/2 - 10, _w/2 + 150, _h/2 + 20)) {
        input_senha = get_string("Digite sua senha:", input_senha);
    }
    
    // Área de clique para o campo de confirmar senha
    if (point_in_rectangle(mouse_x, mouse_y, _w/2 - 150, _h/2 + 40, _w/2 + 150, _h/2 + 70)) {
        input_confirmar_senha = get_string("Confirme sua senha:", input_confirmar_senha);
    }
    
    // Área de clique para o botão "Registrar"
    if (point_in_rectangle(mouse_x, mouse_y, _w/2 - 75, _h/2 + 90, _w/2 + 75, _h/2 + 120)) {
        if (input_senha != input_confirmar_senha) {
            mensagem_feedback = "As senhas não coincidem.";
        } else if (registrar_usuario_local(input_email, input_senha)) {
            // Se o registro for bem-sucedido, volta para a tela de login
            room_goto(rm_login);
        } else {
            mensagem_feedback = "Este email já está em uso.";
        }
    }
    
    // Área de clique para o botão "Voltar"
    if (point_in_rectangle(mouse_x, mouse_y, _w/2 - 75, _h/2 + 140, _w/2 + 75, _h/2 + 170)) {
        room_goto(rm_login);
    }
}