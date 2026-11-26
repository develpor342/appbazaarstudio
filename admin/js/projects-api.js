(function (global) {
  'use strict';

  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64);
  }

  function normalizeProject(input, existing) {
    existing = existing || {};
    var id = input.id || existing.id || slugify(input.title);
    if (!/^[a-z0-9-]+$/.test(id)) {
      throw new Error('Project id/slug must be lowercase letters, numbers, and hyphens');
    }
    var title = (input.title || '').trim();
    if (title.length < 2 || title.length > 80) throw new Error('Title must be 2–80 characters');
    var description = (input.description || '').trim();
    if (description.length < 20 || description.length > 2000) throw new Error('Description must be 20–2000 characters');
    var category = (input.category || '').trim();
    if (!category) throw new Error('Category is required');
    var status = input.status || 'upcoming';
    if (['shipped', 'in-progress', 'upcoming'].indexOf(status) === -1) {
      throw new Error('Invalid status');
    }
    var platforms = Array.isArray(input.platforms) ? input.platforms.filter(Boolean) : [];
    if (status !== 'upcoming' && platforms.length < 1) throw new Error('Select at least one platform');

    var tags = Array.isArray(input.tags)
      ? input.tags
      : String(input.tagsText || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);

    var search = (input.search || [title, description, category, tags.join(' '), platforms.join(' ')].join(' ')).toLowerCase();

    return {
      id: id,
      title: title,
      href: (input.href || '').trim(),
      category: category,
      platforms: platforms,
      featured: !!input.featured,
      published: !!input.published,
      status: status,
      tags: tags,
      description: description,
      search: search,
      icon: input.icon || '',
      iconAlt: input.iconAlt || (title + ' icon'),
      cover: input.cover || '',
      coverAlt: input.coverAlt || (title + ' cover'),
      coverClass: input.coverClass || (status === 'upcoming' ? '' : 'shot'),
      coverWidth: Number(input.coverWidth) || 0,
      coverHeight: Number(input.coverHeight) || 0,
      actions: Array.isArray(input.actions) ? input.actions : [],
      screenshots: Array.isArray(input.screenshots) ? input.screenshots : [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: existing.createdAt || firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  function listProjects(db) {
    return db.collection('projects').get()
      .then(function (snap) {
        return snap.docs.map(function (d) {
          var data = d.data();
          data.id = d.id;
          return data;
        }).sort(function (a, b) {
          var ta = a.updatedAt && a.updatedAt.toMillis ? a.updatedAt.toMillis() : 0;
          var tb = b.updatedAt && b.updatedAt.toMillis ? b.updatedAt.toMillis() : 0;
          return tb - ta;
        });
      });
  }

  function getProject(db, id) {
    return db.collection('projects').doc(id).get().then(function (snap) {
      if (!snap.exists) return null;
      var data = snap.data();
      data.id = snap.id;
      return data;
    });
  }

  function saveProject(db, project, isNew) {
    var ref = db.collection('projects').doc(project.id);
    if (isNew) {
      return ref.get().then(function (snap) {
        if (snap.exists) throw new Error('A project with this id already exists');
        return ref.set(project);
      });
    }
    return ref.set(project, { merge: true });
  }

  function deleteProject(db, id) {
    return db.collection('projects').doc(id).delete();
  }

  function setPublished(db, id, published) {
    return db.collection('projects').doc(id).update({
      published: !!published,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  global.ABSAdmin.slugify = slugify;
  global.ABSAdmin.normalizeProject = normalizeProject;
  global.ABSAdmin.listProjects = listProjects;
  global.ABSAdmin.getProject = getProject;
  global.ABSAdmin.saveProject = saveProject;
  global.ABSAdmin.deleteProject = deleteProject;
  global.ABSAdmin.setPublished = setPublished;
})(window);
