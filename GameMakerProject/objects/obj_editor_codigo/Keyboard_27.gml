// Cancela e fecha sem destrancar
if (instance_exists(ctrl)) ctrl.editor_ativo = false;
with (obj_player) { input_travado = false; }

instance_destroy();
