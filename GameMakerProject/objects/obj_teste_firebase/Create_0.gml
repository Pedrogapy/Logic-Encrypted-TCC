// Chama a função 'RegisterUser' que está no nosso arquivo JavaScript
var email = "teste" + string(irandom(9999)) + "@teste.com";
var senha = "senha123";

show_debug_message("GameMaker: Tentando registrar usuário: " + email);

// Manda a chamada para o JavaScript
browser_execute_javascript("RegisterUser('" + email + "', '" + senha + "');");