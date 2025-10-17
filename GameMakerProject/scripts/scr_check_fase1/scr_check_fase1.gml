/// @function scr_check_fase1(_code)
/// @param _code  (string) código digitado
/// @returns {bool} true se solução correta

function scr_check_fase1(_code) {
    var s = string_lower(_code);
    s = string_replace_all(s, " ", "");
    s = string_replace_all(s, "\r", "");
    s = string_replace_all(s, "\n", "");

    // Ordem correta: ligar_gerador() -> pegar_chave() -> abrir_porta()
    var p1 = string_pos("ligar_gerador()", s);
    var p2 = string_pos("pegar_chave()", s);
    var p3 = string_pos("abrir_porta()", s);

    return (p1 > 0 && p2 > 0 && p3 > 0 && p1 < p2 && p2 < p3);
}
