(function () {
  const stub = (name) => (...args) => {
    console.log(`[stub:${name}]`, args);
    if ((name.includes('saveProgress') || name.includes('setLevel')) && args.length) {
      const lvl = parseInt(args[0], 10);
      if (!isNaN(lvl)) {
        try { parent.location.hash = '#save_level_' + lvl; } catch (_) {}
      }
    }
    return null;
  };

  [
    'firebase_init','firebase2_init',
    'firebase_login','firebase2_login',
    'firebase_logout','firebase2_logout',
    'firebase_saveProgress','firebase2_saveProgress',
    'firebase_getProgress','firebase2_getProgress',
    'firebase_setLevel','firebase2_setLevel',
    'firebase_reportEvent','firebase2_reportEvent'
  ].forEach(f => { if (typeof window[f] !== 'function') window[f] = stub(f); });
})();
