(function (global) {
  'use strict';

  var Admin = global.ABSAdmin;

  function toast(msg, type) {
    var el = document.getElementById('admin-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'admin-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'toast show ' + (type || '');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 4200);
  }

  function requireAdmin(options) {
    options = options || {};
    var boot = Admin.initFirebase();
    if (!boot.ok) {
      if (options.onError) options.onError(boot.error);
      return Promise.reject(new Error(boot.error));
    }
    var auth = boot.auth;
    var db = boot.db;

    return new Promise(function (resolve, reject) {
      var unsub = auth.onAuthStateChanged(function (user) {
        unsub();
        if (!user) {
          if (options.redirect !== false) {
            var next = encodeURIComponent(location.pathname + location.search);
            location.href = 'login.html?next=' + next;
          }
          reject(new Error('Not signed in'));
          return;
        }
        db.collection('admins').doc(user.uid).get()
          .then(function (snap) {
            if (!snap.exists) {
              auth.signOut();
              if (options.redirect !== false) {
                location.href = 'login.html?denied=1';
              }
              reject(new Error('Not an admin'));
              return;
            }
            resolve({ user: user, auth: auth, db: db, storage: boot.storage, admin: snap.data() });
          })
          .catch(function (err) {
            reject(err);
          });
      });
    });
  }

  function login(email, password) {
    var boot = Admin.initFirebase();
    if (!boot.ok) return Promise.reject(new Error(boot.error));
    return boot.auth.signInWithEmailAndPassword(email, password).then(function (cred) {
      return boot.db.collection('admins').doc(cred.user.uid).get().then(function (snap) {
        if (!snap.exists) {
          return boot.auth.signOut().then(function () {
            throw new Error('This account is not authorized for admin access.');
          });
        }
        return cred.user;
      });
    });
  }

  function logout() {
    var boot = Admin.initFirebase();
    if (!boot.ok) return Promise.resolve();
    return boot.auth.signOut();
  }

  Admin.toast = toast;
  Admin.requireAdmin = requireAdmin;
  Admin.login = login;
  Admin.logout = logout;
})(window);
