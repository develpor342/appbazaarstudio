(function () {
  const header = document.getElementById('header');
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');

  function setOpen(open) {
    if (!overlay || !drawer) return;
    overlay.hidden = !open;
    drawer.hidden = !open;
    requestAnimationFrame(function () {
      overlay.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
    });
    document.body.style.overflow = open ? 'hidden' : '';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (menuBtn) menuBtn.addEventListener('click', function () { setOpen(true); });
  if (closeMenu) closeMenu.addEventListener('click', function () { setOpen(false); });
  if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
  if (drawer) {
    drawer.querySelectorAll('[data-close]').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // Homepage project filters
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const cards = Array.prototype.slice.call(grid.querySelectorAll('[data-project]'));
  const empty = document.getElementById('projects-empty');
  const live = document.getElementById('filter-live');
  const clearBtn = document.getElementById('clear-filters');
  const search = document.getElementById('project-search');
  let category = 'all';
  let platform = 'all';

  function apply() {
    const q = (search && search.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(function (card) {
      const cat = card.getAttribute('data-category') || '';
      const platforms = (card.getAttribute('data-platforms') || '').split(/\s+/);
      const text = (card.getAttribute('data-search') || '').toLowerCase();
      const catOk = category === 'all' || cat === category;
      const platOk = platform === 'all' || platforms.indexOf(platform) !== -1;
      const qOk = !q || text.indexOf(q) !== -1;
      const show = catOk && platOk && qOk;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.classList.toggle('show', visible === 0);
    if (clearBtn) {
      clearBtn.classList.toggle('show', category !== 'all' || platform !== 'all' || !!q);
    }
    if (live) live.textContent = visible + ' projects shown';
  }

  document.querySelectorAll('[data-filter-category]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      category = btn.getAttribute('data-filter-category');
      document.querySelectorAll('[data-filter-category]').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      apply();
    });
  });
  document.querySelectorAll('[data-filter-platform]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      platform = btn.getAttribute('data-filter-platform');
      document.querySelectorAll('[data-filter-platform]').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      apply();
    });
  });
  if (search) {
    var t;
    search.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(apply, 200);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      category = 'all';
      platform = 'all';
      if (search) search.value = '';
      document.querySelectorAll('[data-filter-category]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-filter-category') === 'all');
      });
      document.querySelectorAll('[data-filter-platform]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-filter-platform') === 'all');
      });
      apply();
    });
  }
  apply();
})();
