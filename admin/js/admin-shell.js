(function (global) {
  'use strict';

  var NAV = [
    { href: 'index.html', label: 'Dashboard', id: 'dashboard' },
    { href: 'projects.html', label: 'Projects', id: 'projects' },
    { href: 'categories.html', label: 'Categories', id: 'categories' },
    { href: 'messages.html', label: 'Messages', id: 'messages' },
    { href: 'settings.html', label: 'Settings', id: 'settings' }
  ];

  function mountShell(activeId, title, userEmail) {
    var app = document.getElementById('admin-app');
    if (!app) return;

    var navHtml = NAV.map(function (item) {
      var cls = item.id === activeId ? 'active' : '';
      return '<a class="' + cls + '" href="' + item.href + '">' + item.label + '</a>';
    }).join('');

    app.innerHTML =
      '<aside class="admin-sidebar" id="admin-sidebar">' +
        '<div class="admin-brand">App Bazaar Studio<span>Admin</span></div>' +
        '<nav class="admin-nav">' + navHtml + '</nav>' +
        '<div class="spacer"></div>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="admin-logout">Log out</button>' +
      '</aside>' +
      '<div class="sidebar-backdrop" id="sidebar-backdrop" hidden></div>' +
      '<div class="admin-main">' +
        '<header class="admin-topbar">' +
          '<div style="display:flex;align-items:center;gap:0.5rem">' +
            '<button type="button" class="btn btn-secondary btn-sm menu-toggle" id="menu-toggle" aria-label="Menu">Menu</button>' +
            '<h1>' + (title || 'Admin') + '</h1>' +
          '</div>' +
          '<div class="muted" style="font-size:0.8rem">' + (userEmail || '') + '</div>' +
        '</header>' +
        '<div class="admin-content" id="admin-content"></div>' +
      '</div>' +
      '<div id="admin-toast" class="toast" role="status"></div>';

    var sidebar = document.getElementById('admin-sidebar');
    var backdrop = document.getElementById('sidebar-backdrop');
    var toggle = document.getElementById('menu-toggle');
    function closeNav() {
      sidebar.classList.remove('open');
      backdrop.hidden = true;
      backdrop.classList.remove('show');
    }
    function openNav() {
      sidebar.classList.add('open');
      backdrop.hidden = false;
      backdrop.classList.add('show');
    }
    if (toggle) toggle.addEventListener('click', openNav);
    if (backdrop) backdrop.addEventListener('click', closeNav);
    document.getElementById('admin-logout').addEventListener('click', function () {
      global.ABSAdmin.logout().then(function () {
        location.href = 'login.html';
      });
    });
  }

  global.ABSAdmin.mountShell = mountShell;
})(window);
