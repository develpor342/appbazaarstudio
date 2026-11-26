(function (global) {
  'use strict';

  var IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  var DOWNLOAD_TYPES = [
    'application/vnd.android.package-archive',
    'application/zip',
    'application/octet-stream',
    'application/x-zip-compressed'
  ];
  var IMAGE_MAX = 5 * 1024 * 1024;
  var DOWNLOAD_MAX = 200 * 1024 * 1024;

  function validateImage(file) {
    if (!file) return 'No file selected';
    if (IMAGE_TYPES.indexOf(file.type) === -1) return 'Images must be JPEG, PNG, or WebP';
    if (file.size > IMAGE_MAX) return 'Image must be under 5 MB';
    return null;
  }

  function validateDownload(file) {
    if (!file) return 'No file selected';
    var name = (file.name || '').toLowerCase();
    var okExt = /\.(apk|zip)$/.test(name);
    var okType = DOWNLOAD_TYPES.indexOf(file.type) !== -1 || file.type === '' || file.type === 'application/octet-stream';
    if (!okExt && !okType) return 'Downloads must be APK or ZIP';
    if (file.size > DOWNLOAD_MAX) return 'File must be under 200 MB';
    return null;
  }

  function safeName(name) {
    return String(name || 'file').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80);
  }

  function uploadProjectFile(storage, projectId, folder, file) {
    var path = 'projects/' + projectId + '/' + folder + '/' + Date.now() + '-' + safeName(file.name);
    var ref = storage.ref().child(path);
    return ref.put(file, { contentType: file.type || 'application/octet-stream' })
      .then(function () { return ref.getDownloadURL(); })
      .then(function (url) {
        return { url: url, path: path, name: file.name };
      });
  }

  global.ABSAdmin.validateImage = validateImage;
  global.ABSAdmin.validateDownload = validateDownload;
  global.ABSAdmin.uploadProjectFile = uploadProjectFile;
})(window);
