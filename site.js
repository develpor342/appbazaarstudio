(function () {
  // Contact / ads config lives in data/site-config.js (placeholders only — do not invent).
  window.ABS_CONTACT = window.ABS_CONTACT || {
    email: 'asankarobar.officials@gmail.com',
    whatsapp: '',
    linkedin: '',
    github: ''
  };

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

  // Optional social / WhatsApp — only when real URLs are configured
  var socialHost = document.getElementById('optional-social');
  if (socialHost) {
    var cfg = window.ABS_CONTACT;
    var bits = [];
    if (cfg.whatsapp) {
      bits.push('<a class="contact-link" href="' + cfg.whatsapp + '" target="_blank" rel="noopener noreferrer"><span>WhatsApp<span class="sub">Chat with studio</span></span></a>');
    }
    if (cfg.linkedin) {
      bits.push('<a class="contact-link" href="' + cfg.linkedin + '" target="_blank" rel="noopener noreferrer"><span>LinkedIn<span class="sub">Studio profile</span></span></a>');
    }
    if (cfg.github) {
      bits.push('<a class="contact-link" href="' + cfg.github + '" target="_blank" rel="noopener noreferrer"><span>GitHub<span class="sub">Public repositories</span></span></a>');
    }
    if (bits.length) {
      socialHost.hidden = false;
      socialHost.innerHTML = '<div class="contact-link-row">' + bits.join('') + '</div>';
    }
  }

  // Scroll reveal — keep content visible if observer misses a section
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function markReveal(el) {
    if (el) el.classList.add('in');
  }
  function revealInView() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94 && r.bottom > 40) markReveal(el);
    });
  }
  function wireReveal() {
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            markReveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '80px 0px 0px 0px' });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
      revealInView();
      window.addEventListener('scroll', revealInView, { passive: true });
      window.addEventListener('resize', revealInView);
      setTimeout(function () {
        document.querySelectorAll('.reveal:not(.in)').forEach(markReveal);
      }, 2200);
    } else {
      document.querySelectorAll('.reveal').forEach(markReveal);
    }
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function platformLabel(p) {
    if (!p) return '';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  function actionButton(a) {
    var cls = a.style === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
    if (a.comingSoon) {
      return '<span class="' + cls + ' btn-coming-soon" aria-disabled="true" title="Coming soon">' +
        escapeHtml(a.label) + ' · Coming Soon</span>';
    }
    var dl = a.download ? ' download' : '';
    return '<a class="' + cls + '" href="' + escapeHtml(a.href || '#') + '"' + dl + '>' +
      escapeHtml(a.label) + '</a>';
  }

  function tagHtml(tags) {
    return (tags || []).map(function (t) {
      var extra = (String(t).toLowerCase() === 'featured') ? ' tag-featured' : '';
      return '<span class="tag' + extra + '">' + escapeHtml(t) + '</span>';
    }).join('');
  }

  function chipHtml(platforms) {
    return (platforms || []).map(function (p) {
      return '<span class="chip">' + escapeHtml(platformLabel(p)) + '</span>';
    }).join('');
  }

  function renderFeaturedCard(p) {
    var media = '';
    if (p.cover) {
      media = '<div class="case-media">' +
        '<img class="' + escapeHtml(p.coverClass || 'shot') + '" src="' + escapeHtml(p.cover) + '"' +
        (p.coverWidth ? ' width="' + p.coverWidth + '"' : '') +
        (p.coverHeight ? ' height="' + p.coverHeight + '"' : '') +
        ' alt="' + escapeHtml(p.coverAlt || p.title) + '" loading="lazy" decoding="async" />' +
        '</div>';
    }
    var icon = p.icon
      ? '<img class="case-icon" src="' + escapeHtml(p.icon) + '" width="48" height="48" alt="' + escapeHtml(p.iconAlt || '') + '" />'
      : '<div class="case-icon-fallback" aria-hidden="true">' + escapeHtml((p.title || '?').slice(0, 4)) + '</div>';
    var chips = chipHtml(p.platforms);
    var actions = (p.actions || []).map(actionButton).join('\n            ');
    return '<article class="case-card">' +
      media +
      '<div class="case-body">' +
      '<div class="case-top">' + icon +
      '<div>' + tagHtml(p.tags) + '</div>' +
      '</div>' +
      '<h3>' + escapeHtml(p.title) + '</h3>' +
      '<p>' + escapeHtml(p.description || '') + '</p>' +
      (chips ? '<div style="margin-top:0.75rem;">' + chips + '</div>' : '') +
      '<div class="case-actions">' + actions + '</div>' +
      '</div></article>';
  }

  function renderProjectCard(p) {
    if (p.status === 'upcoming') {
      return '<div class="project-card is-soon" data-project aria-disabled="true"' +
        ' data-category="upcoming" data-platforms=""' +
        ' data-search="' + escapeHtml(p.search || '') + '">' +
        '<div class="project-card-body">' +
        '<span class="tag">Upcoming</span>' +
        '<h3>' + escapeHtml(p.title || 'Future release') + '</h3>' +
        '<p>' + escapeHtml(p.description || 'Next studio product — details soon.') + '</p>' +
        '<span class="card-go">Soon</span>' +
        '</div></div>';
    }
    var platforms = (p.platforms || []).join(' ');
    var icon = p.icon
      ? '<img class="case-icon" src="' + escapeHtml(p.icon) + '" width="40" height="40" alt="" loading="lazy" decoding="async" />'
      : '';
    var chips = chipHtml(p.platforms);
    return '<a class="project-card" href="' + escapeHtml(p.href || '#') + '" data-project' +
      ' data-category="' + escapeHtml(p.category || '') + '"' +
      ' data-platforms="' + escapeHtml(platforms) + '"' +
      ' data-search="' + escapeHtml(p.search || '') + '">' +
      '<div class="project-card-body">' +
      icon +
      tagHtml(p.tags) +
      '<h3>' + escapeHtml(p.title) + '</h3>' +
      '<p>' + escapeHtml(p.description || '') + '</p>' +
      (chips ? '<div style="margin-top:0.75rem;">' + chips + '</div>' : '') +
      '<span class="card-go">View →</span>' +
      '</div></a>';
  }

  function wireFilters(grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-project]'));
    var empty = document.getElementById('projects-empty');
    var live = document.getElementById('filter-live');
    var clearBtn = document.getElementById('clear-filters');
    var search = document.getElementById('project-search');
    var category = 'all';
    var platform = 'all';

    function apply() {
      var q = (search && search.value || '').trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var cat = card.getAttribute('data-category') || '';
        var platforms = (card.getAttribute('data-platforms') || '').split(/\s+/);
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var catOk = category === 'all' || cat === category;
        var platOk = platform === 'all' || platforms.indexOf(platform) !== -1;
        var qOk = !q || text.indexOf(q) !== -1;
        var show = catOk && platOk && qOk;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle('show', visible === 0);
      if (clearBtn) clearBtn.classList.toggle('show', category !== 'all' || platform !== 'all' || !!q);
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
  }

  function applyProjectList(list) {
    var featuredEl = document.getElementById('featured-grid');
    var gridEl = document.getElementById('projects-grid');
    list = list || [];
    if (featuredEl) {
      featuredEl.innerHTML = list.filter(function (p) { return p.featured; })
        .map(renderFeaturedCard).join('');
    }
    if (gridEl) {
      gridEl.innerHTML = list.map(renderProjectCard).join('');
      wireFilters(gridEl);
    }
    wireReveal();
    revealInView();
  }

  function loadProjectsFromJson() {
    return fetch('data/projects.json')
      .then(function (r) {
        if (!r.ok) throw new Error('projects.json ' + r.status);
        return r.json();
      })
      .then(function (data) {
        return (data && data.projects) || [];
      });
  }

  function firebaseConfigReady() {
    var c = window.ABS_FIREBASE || {};
    return c.apiKey && c.apiKey !== 'REPLACE_ME' && c.apiKey !== 'YOUR_API_KEY'
      && c.projectId === 'app-bazaar-studio';
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function ensurePublicFirebase() {
    if (!firebaseConfigReady()) return Promise.resolve(null);
    var chain = Promise.resolve();
    if (!window.firebase) {
      chain = chain
        .then(function () { return loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js'); })
        .then(function () { return loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'); });
    }
    return chain.then(function () {
      if (!firebase.apps.length) firebase.initializeApp(window.ABS_FIREBASE);
      return firebase.firestore();
    });
  }

  function loadProjectsFromFirestore(db) {
    return db.collection('projects').where('published', '==', true).get()
      .then(function (snap) {
        return snap.docs.map(function (d) {
          var data = d.data();
          data.id = d.id;
          return data;
        });
      });
  }

  function loadProjects() {
    var featuredEl = document.getElementById('featured-grid');
    var gridEl = document.getElementById('projects-grid');
    if (!featuredEl && !gridEl) {
      wireReveal();
      return;
    }

    ensurePublicFirebase()
      .then(function (db) {
        if (!db) return loadProjectsFromJson();
        return loadProjectsFromFirestore(db).then(function (list) {
          if (!list.length) return loadProjectsFromJson();
          return list;
        }).catch(function (err) {
          console.warn('Firestore projects unavailable, using JSON fallback', err);
          return loadProjectsFromJson();
        });
      })
      .then(applyProjectList)
      .catch(function (err) {
        console.error('Failed to load projects', err);
        wireReveal();
      });
  }

  loadProjects();

  // Contact form → FormSubmit (real email delivery)
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submitBtn = document.getElementById('contact-submit');
  var emailTo = (window.ABS_CONTACT && window.ABS_CONTACT.email) || 'asankarobar.officials@gmail.com';

  function showErr(id, on) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('show', !!on);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('c-name');
    var email = document.getElementById('c-email');
    var company = document.getElementById('c-company');
    var type = document.getElementById('c-type');
    var budget = document.getElementById('c-budget');
    var message = document.getElementById('c-message');

    var nameV = name.value.trim();
    var emailV = email.value.trim();
    var typeV = type ? type.value.trim() : '';
    var messageV = message.value.trim();
    var companyV = company ? company.value.trim() : '';
    var budgetV = budget ? budget.value.trim() : '';

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV);
    var ok = true;

    [name, email, type, message].forEach(function (f) {
      if (f) f.classList.remove('error');
    });
    showErr('err-name', false);
    showErr('err-email', false);
    showErr('err-type', false);
    showErr('err-message', false);

    if (!nameV) { ok = false; name.classList.add('error'); showErr('err-name', true); }
    if (!emailOk) { ok = false; email.classList.add('error'); showErr('err-email', true); }
    if (type && !typeV) { ok = false; type.classList.add('error'); showErr('err-type', true); }
    if (!messageV) { ok = false; message.classList.add('error'); showErr('err-message', true); }

    status.classList.add('show');
    status.classList.remove('ok', 'error');

    if (!ok) {
      status.textContent = 'Please complete the required fields.';
      status.classList.add('error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    status.textContent = 'Sending your inquiry…';

    var payload = {
      name: nameV,
      email: emailV,
      company: companyV || '—',
      project_type: typeV || 'General',
      budget: budgetV || '—',
      message: messageV,
      _subject: '[App Bazaar Studio] ' + (typeV || 'Project') + ' inquiry from ' + nameV
    };

    var inquiryDoc = {
      name: nameV,
      email: emailV,
      company: companyV || '',
      projectType: typeV || 'General',
      budget: budgetV || '',
      message: messageV,
      read: false,
      status: 'new',
      createdAt: null
    };

    ensurePublicFirebase()
      .catch(function () { return null; })
      .then(function (db) {
        var writes = [
          fetch('https://formsubmit.co/ajax/' + encodeURIComponent(emailTo), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          }).then(function (res) {
            if (!res.ok) throw new Error('send_failed');
            return res.json().catch(function () { return {}; });
          })
        ];
        if (db) {
          inquiryDoc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          writes.push(db.collection('inquiries').add(inquiryDoc).catch(function (err) {
            console.warn('Inquiry Firestore write failed', err);
          }));
        }
        return Promise.all(writes);
      })
      .then(function () {
        status.textContent = 'Message sent. We will reply within 24–48 business hours.';
        status.classList.add('ok');
        form.reset();
      })
      .catch(function () {
        status.textContent = 'Could not send right now. Please email ' + emailTo + ' directly.';
        status.classList.add('error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.getAttribute('data-label') || 'Send project inquiry';
        }
      });
  });

  if (submitBtn && !submitBtn.getAttribute('data-label')) {
    submitBtn.setAttribute('data-label', submitBtn.textContent);
  }
})();
