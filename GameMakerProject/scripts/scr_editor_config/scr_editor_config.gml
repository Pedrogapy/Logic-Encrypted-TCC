/// scr_editor_config(fase_num) -> struct cfg
/// Retorna a configuracao completa para uma fase especifica.



function scr_editor_config(_fase) {
    var cfg = {};

    switch (_fase) {
        // ================== FASE 1 (Variaveis) ==================
        case 1:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 1 - O que sao Variaveis?\nNomes de variaveis devem ser escritos exatamente como foram declarados. Cuidado com erros de digitacao!";
            cfg.prompt   = [
                "// Variaveis guardam valores.",
                "variavel mensagem = 'Bem-vindo!';",
                "",
                "// Para usar o valor, use o nome exato.",
                "exibir( %1 );"
            ];
            cfg.blanks_expected   = [ "mensagem" ];
            cfg.options_per_blank = [ ["mensagen", "mensagem", "MENSAGEM"] ];
            cfg.next_index = 2;
            cfg.conceitos = [ "Variaveis", "Declaracao", "Uso de Variaveis" ];
            cfg.dica = "Nomes de variaveis devem ser escritos exatamente como foram declarados. Cuidado com erros de digitacao!";
        break;

        // ================== FASE 2 (Sequencia) ==================
        case 2:
            cfg.mode     = EditorMode.REORDER;
            cfg.title    = "Fase 2 - A Sequencia Logica";
            cfg.objetivo = "Objetivo: Organize os passos para se vestir e sair de casa.\nDica: Voce nao pode vestir uma roupa que ainda nao pegou.";

            cfg.lines    = [ 
                "vestir_roupa();",
                "sair_de_casa();",
                "abrir_armario();", 
                "pegar_roupa();"
            ];

            cfg.solution = [ 
                "abrir_armario();", 
                "pegar_roupa();",
                "vestir_roupa();",
                "sair_de_casa();"
            ];

            cfg.next_index = 3;
            cfg.conceitos = [ "Sequencia de comandos" ];
            cfg.dica = "Voce nao pode vestir uma roupa que ainda nao pegou.";
        break;

        // ================== FASE 3 (Condicional) ==================
        case 3:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 3 - Condicionais (se/senao)\n A porta so deve ser aberta se a quantidade de chaves for maior que zero.";
            cfg.prompt   = [
                "se (chaves %1 0) {",
                "    abrir_porta();",
                "} senao {",
                "    procurar_chave();",
                "}"
            ];
            cfg.blanks_expected   = [ "for maior que >" ];
            cfg.options_per_blank = [ ["for maior que >","for menor que <","for igual a =="] ];
            cfg.next_index = 4;
            cfg.conceitos = [ "Condicionais (if/else)", "Operadores relacionais" ];
            cfg.dica = "A porta so deve ser aberta se a quantidade de chaves for maior que zero.";
        break;

        // ================== FASE 4 (Condicional) ==================
        case 4:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 4 - Condicionais (comparacao)\nA recarga e necessaria quando a energia esta baixa, ou seja, menor ou igual a 50.";
            cfg.prompt   = [
                "if (energia %1 50) {",
                "    recarregar();",
                "} else {",
                "    continuar();",
                "}"
            ];
            cfg.blanks_expected   = [ "menor ou igual a <=" ];
            cfg.options_per_blank = [ ["menor que <", "menor ou igual a <=", "maior que >", "maior ou igual a >="] ];
            cfg.next_index = 5;
            cfg.conceitos = [ "Condicionais (if/else)", "Operadores <=, >=" ];
            cfg.dica = "A recarga e necessaria quando a energia esta baixa, ou seja, menor ou igual a 50.";
        break;

        // ================== FASE 5 (Lacos) ==================
        case 5:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 5 - Laco para\nTente abrir a porta 3 vezes e você deve ter sucesso";
            cfg.prompt   = [
                "Para a seguinte condicao (i é = 0; enquanto i for %1 3; i %2) {",
                "    tentar_abrir_a_porta(1);",
                "}"
            ];
            cfg.blanks_expected   = [ "menor que", "aumenta +1 no seu valor" ];
            cfg.options_per_blank = [ ["menor que", "maior que", "=="], ["aumenta +1 no seu valor", "diminui 1 no seu valor"] ];
            cfg.next_index = 6;
            cfg.conceitos = [ "Laco for", "Contador", "Condicao de parada" ];
            cfg.dica = "Para repetir 3 vezes (para i = 0, 1 e 2), a condicao deve ser 'enquanto i for menor que 3'.";
        break;

        // ================== FASE 6 (Lacos) ==================
        case 6:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 6 - Laco while\nO laco deve continuar enquanto a condicao for verdadeira";
            cfg.prompt   = [
                "enquanto (porta_fechada %1 verdade) {",
                "    abrir_porta();",
                "}"
            ];
            cfg.blanks_expected   = [ "igual a" ];
            cfg.options_per_blank = [ ["igual a","diferente de"] ];
            cfg.next_index = 7;
            cfg.conceitos = [ "Laco while", "Condicao booleana" ];
            cfg.dica = "O laco deve continuar enquanto a condicao 'porta_fechada e igual a true' for verdadeira.";
        break;

        // ================== FASE 7 (Logicos) ==================
        case 7:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 7 - Operadores logicos (&&)\nAs duas condicoes precisam ser verdadeiras ao mesmo tempo.";
            cfg.prompt   = [
                "se a seguinte condicao for verdadeira (tem_chave %1 porta_trancada) {",
                "    destrancar_porta();",
                "}"
            ];
            cfg.blanks_expected   = [ "e" ];
            cfg.options_per_blank = [ ["e","ou"] ];
            cfg.next_index = 8;
            cfg.conceitos = [ "Operadores logicos && e ||" ];
            cfg.dica = "As duas condicoes precisam ser verdadeiras ao mesmo tempo. Use o operador 'E' (&&).";
        break;

        // ================== FASE 8 (Logicos) ==================
        case 8:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 8 - Negacao logica (!)";
            cfg.prompt   = [
                "se (A porta %1 esta trancada) {",
                "    abrir_porta();",
                "}"
            ];
            cfg.blanks_expected   = [ "nao" ];
            cfg.options_per_blank = [ ["nao", "realmente","provavelmente"] ];
            cfg.next_index = 9;
            cfg.conceitos = [ "Negacao logica (!)" ];
            cfg.dica = "O alarme deve soar se o sensor NAO estiver ok. Use o operador de negacao.";
        break;

        // ================== FASE 9 (Integracao) ==================
        case 9:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 9 - Integracao (seq + cond + laco)";
            cfg.prompt   = [
                "Se a seguinte condicao for verdadeira (ter_chave %1 porta_trancada) {",
                "    Para a seguinte condicao (i = 0;se i for %2 2; i %3) {",
                "    abrir_porta();",
                "} senao {",
                "    procurar_chave();",
                "}"
            ];
            cfg.blanks_expected   = [ "e", "menor que", "aumenta +1 em seu valor" ];
            cfg.options_per_blank = [ ["e","ou"], ["menor que","maior que","igual a"], ["aumenta +1 em seu valor","diminui 1 em seu valor"] ];
            cfg.next_index = 10;
            cfg.conceitos = [ "Integracao: sequencia, if/else, for" ];
            cfg.dica = "Combine as tres ideias ja praticadas: condicao E, laco 'menor que' e incremento.";
        break;

        // ================== FASE 10 (Integracao final) ==================
        case 10:
            cfg.mode     = EditorMode.BLANKS;
            cfg.title    = "Fase 10 - Integracao Final";
            cfg.prompt   = [
                "se (energia %1 0 %2 tem_cartao_de_acesso) {",
                "    enquanto (porta_fechada %3 for verdade) { tentar_abrir(); }",
                "} senao {",
                "    recarregar();",
                "}"
            ];
            cfg.blanks_expected   = [ "maior que", "e", "igual a" ];
            cfg.options_per_blank = [ ["menor que","menor ou igual a","maior que","maior ou igual a"], ["e","ou"], ["igual a","diferente de"] ];
            cfg.next_index = 11;
            cfg.conceitos = [ "Integracao final de conceitos" ];
            cfg.dica = "Se voce tiver energia suficiente E um kit, tente abrir a porta repetidamente.";
        break;

        // Caso padrao para fases nao definidas
        default:
            cfg.mode     = EditorMode.REORDER;
            cfg.title    = "Fase Desconhecida";
            cfg.lines    = [ "ERRO: Fase nao encontrada." ];
            cfg.solution = [ "ERRO: Fase nao encontrada." ];
            cfg.next_index = _fase;
            cfg.conceitos = [];
            cfg.dica = "Esta fase nao foi configurada.";
        break;
    }

    return cfg;
}