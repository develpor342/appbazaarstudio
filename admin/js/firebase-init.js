(function (global) {
  'use strict';

  function configReady() {
    var c = global.ABS_FIREBASE || {};
    return c.apiKey && c.apiKey !== 'REPLACE_ME' && c.apiKey !== 'YOUR_API_KEY'
      && c.projectId === 'app-bazaar-studio';
  }

  function initFirebase() {
    if (!configReady()) {
      return { ok: false, error: 'Firebase config missing. Paste Web app keys into admin/js/firebase-config.js for project app-bazaar-studio.' };
    }
    if (!global.firebase) {
      return { ok: false, error: 'Firebase SDK not loaded.' };
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(global.ABS_FIREBASE);
    }
    return {
      ok: true,
      auth: firebase.auth(),
      db: firebase.firestore(),
      storage: firebase.storage()
    };
  }

  global.ABSAdmin = global.ABSAdmin || {};
  global.ABSAdmin.configReady = configReady;
  global.ABSAdmin.initFirebase = initFirebase;
})(window);
