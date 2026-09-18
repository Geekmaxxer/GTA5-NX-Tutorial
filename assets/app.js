(function () {
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  var sidebar = document.querySelector('.sidebar');
  var menuToggle = document.querySelector('.menu-toggle');
  var defaultId = panels.length ? panels[0].id : null;

  function showPanel(id, opts) {
    var target = document.getElementById(id) ? id : defaultId;
    if (!target) return;

    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.id === target);
    });
    navItems.forEach(function (n) {
      n.classList.toggle('is-active', n.getAttribute('data-target') === target);
    });

    document.title = (document.querySelector('#' + target + ' h1') || {}).textContent
      ? document.querySelector('#' + target + ' h1').textContent + ' — GTA V Switch Port Guide'
      : 'GTA V Switch Port Guide';

    if (!opts || !opts.skipScroll) {
      document.querySelector('main').scrollTo({ top: 0, behavior: 'auto' });
    }

    if (sidebar) sidebar.classList.remove('is-open');
  }

  navItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-target');
      history.pushState(null, '', '#' + id);
      showPanel(id);
    });
  });

  // Prev/Next footer navigation
  document.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-goto');
      history.pushState(null, '', '#' + id);
      showPanel(id);
    });
  });

  window.addEventListener('popstate', function () {
    var id = location.hash.replace('#', '');
    showPanel(id || defaultId);
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      sidebar.classList.toggle('is-open');
    });
  }

  // Initial load
  var initial = location.hash.replace('#', '');
  showPanel(initial || defaultId, { skipScroll: true });
})();
