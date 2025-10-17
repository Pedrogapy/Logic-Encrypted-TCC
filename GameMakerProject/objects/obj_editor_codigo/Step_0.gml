// Só pisca o cursor aqui. NADA de ler teclas no Step.
timer_cursor += 1;
if (timer_cursor >= room_speed div 2) {
    cursor_visivel = !cursor_visivel;
    timer_cursor = 0;
}
