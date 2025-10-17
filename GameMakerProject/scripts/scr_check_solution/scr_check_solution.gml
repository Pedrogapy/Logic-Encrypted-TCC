/// scr_check_solution(editor_lines_array, solution_array)
if (argument_count < 2) return false;
var lines = argument0;
var solution = argument1;

// proteção de tipos
if (!is_array(lines) || !is_array(solution)) return false;

// estratégia simples: cada elemento de solution deve aparecer em alguma linha
for (var i = 0; i < array_length(solution); i++) {
    var s = string(solution[i]);
    var found = false;
    for (var j = 0; j < array_length(lines); j++) {
        if (string_pos(s, string(lines[j])) > 0 || string_pos(string(lines[j]), s) > 0) {
            found = true; break;
        }
    }
    if (!found) return false;
}
return true;
