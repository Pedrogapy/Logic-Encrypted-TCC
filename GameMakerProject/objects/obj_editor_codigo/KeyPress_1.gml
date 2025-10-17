var ch = keyboard_lastchar;

// Aceita apenas caracteres imprimíveis básicos
if (string_length(ch) == 1) {
    var c = ord(ch);
    if (c >= 32 && c <= 126) {
        texto_digitado += ch;
    }
}
