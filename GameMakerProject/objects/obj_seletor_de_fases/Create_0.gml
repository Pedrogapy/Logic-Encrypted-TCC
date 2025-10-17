// Prepara as variáveis para a tela de seleção

// Array para controlar quais fases estão desbloqueadas.
// Apenas a primeira (índice 0) começa como 'true'.
fases_desbloqueadas = array_create(10, false);
fases_desbloqueadas[0] = true;

// Configurações do grid de botões
var _colunas = 5;
var _start_x = 200;
var _start_y = 200;
var _espacamento_x = 150;
var _espacamento_y = 150;

// Cria as 10 instâncias "marcadores" dos botões
for (var i = 0; i < 10; i++) {
    var _xx = _start_x + (i mod _colunas) * _espacamento_x;
    var _yy = _start_y + (i div _colunas) * _espacamento_y;
    
    var _botao = instance_create_layer(_xx, _yy, "Instances", obj_botao_fase);
    _botao.fase_num = i + 1;
}