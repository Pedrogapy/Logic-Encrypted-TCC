var _clique = mouse_check_button_pressed(mb_left);

if (_clique) {
    var _w = display_get_gui_width();
    var _h = display_get_gui_height();
    var _mouse_x = device_mouse_x_to_gui(0);
    var _mouse_y = device_mouse_y_to_gui(0);
    
    // Área de clique para o campo de email
    if (point_in_rectangle(_mouse_x, _mouse_y, _w/2 - 150, _h/2 - 40, _w/2 + 150, _h/2 - 10)) {
        var _prompt = "Digite seu email:";
        // A função get_string abre uma janela para o utilizador digitar
        input_email = get_string(_prompt, input_email);
    }
    
    // Área de clique para o campo de senha
    if (point_in_rectangle(_mouse_x, _mouse_y, _w/2 - 150, _h/2 + 10, _w/2 + 150, _h/2 + 40)) {
        var _prompt = "Digite sua senha:";
        input_senha = get_string(_prompt, input_senha);
    }
    
    // Área de clique para o botão "Entrar"
    if (point_in_rectangle(_mouse_x, _mouse_y, _w/2 - 75, _h/2 + 60, _w/2 + 75, _h/2 + 90)) {
        if (logar_usuario(input_email, input_senha)) {
            // Se o login for bem-sucedido:
            // 1. Cria a instância persistente do obj_controle
            instance_create_layer(0, 0, "Instances", obj_controle);
            
            // 2. Avisa ao obj_controle quem é o utilizador logado
            obj_controle.current_user_id = input_email;
            
            // 3. Vai para o menu principal
            room_goto(rm_menu);
        } else {
            mensagem_feedback = "Email ou senha incorretos.";
        }
    }
    
    // (Adicionaremos um botão de registo aqui depois)
}