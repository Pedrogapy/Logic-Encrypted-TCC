fase_id = 1;
tempo_inicio = current_time;
erros = 0;
fase_concluida = false;

// salva/append simples em INI (HTML5 usa storage)
function salvar_relatorio() {
    var tempo_total_ms = current_time - tempo_inicio;
    var tempo_total_s = tempo_total_ms / 1000;

    ini_open("relatorio.ini");
    // exemplo: seção por fase
    var sec = "fase_" + string(fase_id);
    ini_write_real(sec, "tempo_segundos", tempo_total_s);
    ini_write_real(sec, "erros", erros);
    ini_write_string(sec, "concluida", fase_concluida ? "sim" : "nao");
    ini_close();
}
