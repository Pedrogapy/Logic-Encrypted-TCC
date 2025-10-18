// firebase-api.js — stubs p/ impedir crash
(function () {
  const stub = (name) => (...args) => {
    console.log(`[stub:${name}]`, args);
    // se tentar salvar progresso, redireciona p/ hash que o site já entende
    if ((name.includes('saveProgress') || name.includes('setLevel')) && args.length) {
      const lvl = parseInt(args[0], 10);
      if (!isNaN(lvl)) { try { parent.location.hash = '#save_level_' + lvl; } catch(_){} }
    }
    return null;
  };
  ['firebase_init','firebase2_init','firebase_login','firebase2_login',
   'firebase_logout','firebase2_logout','firebase_saveProgress','firebase2_saveProgress',
   'firebase_getProgress','firebase2_getProgress','firebase_setLevel','firebase2_setLevel',
   'firebase_reportEvent','firebase2_reportEvent'
  ].forEach(n => { if (typeof window[n] !== 'function') window[n] = stub(n); });
})();
