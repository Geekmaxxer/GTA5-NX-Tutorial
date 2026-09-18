(function () {
  'use strict';

  /* =========================================================
     GTA V SWITCH PORT GUIDE
     Navigation / clipboard / lightbox
     ========================================================= */

  var panels = [].slice.call(
    document.querySelectorAll('.panel')
  );

  var nav = [].slice.call(
    document.querySelectorAll('.nav-item')
  );

  var sidebar =
    document.querySelector('.sidebar');

  var menu =
    document.querySelector('.menu-toggle');

  var defaultId =
    panels.length
      ? panels[0].id
      : null;

  var names = {
    installing: 'Installing',
    updating: 'Updating',
    dlcs: 'Installing DLCs'
  };

  var order = [
    'installing',
    'updating',
    'dlcs'
  ];


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function closeMenu() {
    if (sidebar) {
      sidebar.classList.remove('is-open');
    }

    if (menu) {
      menu.setAttribute(
        'aria-expanded',
        'false'
      );
    }
  }


  if (menu && sidebar) {
    menu.addEventListener(
      'click',
      function () {

        var open =
          sidebar.classList.toggle(
            'is-open'
          );

        menu.setAttribute(
          'aria-expanded',
          String(open)
        );

      }
    );
  }


  /* =========================================================
     SECTION NAVIGATION
     ========================================================= */

  function show(id, opts) {

    var target =
      document.getElementById(id)
        ? id
        : defaultId;

    if (!target) return;


    /* Show the selected panel */

    panels.forEach(function (panel) {

      panel.classList.toggle(
        'is-active',
        panel.id === target
      );

    });


    /* Update sidebar */

    nav.forEach(function (item) {

      var active =
        item.getAttribute(
          'data-target'
        ) === target;

      item.classList.toggle(
        'is-active',
        active
      );

      if (active) {
        item.setAttribute(
          'aria-current',
          'page'
        );
      } else {
        item.removeAttribute(
          'aria-current'
        );
      }

    });


    /* Update document title */

    var heading =
      document.querySelector(
        '#' + target + ' h1'
      );

    document.title =
      (
        heading
          ? heading.textContent
          : 'GTA V Switch Port Guide'
      ) +
      ' - GTA V Switch Port Guide';


    /* Update top bar */

    var top =
      document.getElementById(
        'topbar-section'
      );

    if (top) {
      top.textContent =
        names[target] || target;
    }


    /* Update section counter */

    var count =
      document.getElementById(
        'progress-count'
      );

    if (count) {

      var index =
        order.indexOf(target);

      var number =
        index >= 0
          ? index + 1
          : 1;

      count.textContent =
        String(number).padStart(2, '0') +
        ' / ' +
        String(panels.length).padStart(2, '0');

    }


    /* Return to top */

    if (!opts || !opts.skipScroll) {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }


    closeMenu();
  }


  function go(id) {

    history.pushState(
      null,
      '',
      '#' + id
    );

    show(id);

  }


  /* Sidebar buttons */

  nav.forEach(function (button) {

    button.addEventListener(
      'click',
      function () {

        go(
          button.getAttribute(
            'data-target'
          )
        );

      }
    );

  });


  /* Previous / next buttons */

  document
    .querySelectorAll('[data-goto]')
    .forEach(function (button) {

      button.addEventListener(
        'click',
        function () {

          go(
            button.getAttribute(
              'data-goto'
            )
          );

        }
      );

    });


  /* Browser back / forward */

  window.addEventListener(
    'popstate',
    function () {

      show(
        location.hash.slice(1) ||
        defaultId
      );

    }
  );


  /* =========================================================
     COPY PATHS
     ========================================================= */

  document
    .querySelectorAll('.copy-btn')
    .forEach(function (button) {

      button.addEventListener(
        'click',
        async function () {

          var row =
            button.parentElement;

          var element =
            row &&
            row.querySelector(
              '.path'
            );

          var value =
            element
              ? element.textContent.trim()
              : '';


          try {

            await navigator
              .clipboard
              .writeText(value);

          } catch (error) {

            var textarea =
              document.createElement(
                'textarea'
              );

            textarea.value =
              value;

            textarea.style.position =
              'fixed';

            textarea.style.opacity =
              '0';

            document.body.appendChild(
              textarea
            );

            textarea.select();

            try {
              document.execCommand(
                'copy'
              );
            } catch (_) {
              // Ignore fallback failure.
            }

            textarea.remove();

          }


          var original =
            button.textContent;

          button.textContent = '✓';

          button.classList.add(
            'is-copied'
          );


          clearTimeout(
            button._copyTimeout
          );


          button._copyTimeout =
            setTimeout(
              function () {

                button.textContent =
                  original || '⧉';

                button.classList.remove(
                  'is-copied'
                );

              },
              1400
            );

        }
      );

    });


  /* =========================================================
     SCREENSHOT LIGHTBOX
     ========================================================= */

  var lightbox =
    document.getElementById(
      'lightbox'
    );

  var lightboxImage =
    document.getElementById(
      'lightbox-image'
    );

  var lightboxCaption =
    document.getElementById(
      'lightbox-caption'
    );


  function closeLightbox() {

    if (!lightbox) return;

    lightbox.hidden = true;

    if (lightboxImage) {
      lightboxImage.removeAttribute(
        'src'
      );
    }

    document.body.style.overflow =
      '';

  }


  function openLightbox(figure) {

    if (
      !lightbox ||
      !lightboxImage
    ) {
      return;
    }


    var image =
      figure.querySelector('img');

    if (!image) return;


    var caption =
      figure.querySelector(
        'figcaption'
      );


    lightboxImage.src =
      image.currentSrc ||
      image.src;

    lightboxImage.alt =
      image.alt || '';


    if (lightboxCaption) {
      lightboxCaption.textContent =
        caption
          ? caption.textContent
          : '';
    }


    lightbox.hidden = false;

    document.body.style.overflow =
      'hidden';


    var closeButton =
      lightbox.querySelector(
        '.lightbox-close'
      );

    if (closeButton) {
      closeButton.focus();
    }

  }


  document
    .querySelectorAll(
      '.shot.is-zoomable'
    )
    .forEach(function (figure) {

      figure.setAttribute(
        'tabindex',
        '0'
      );

      figure.setAttribute(
        'role',
        'button'
      );


      figure.addEventListener(
        'click',
        function () {
          openLightbox(figure);
        }
      );


      figure.addEventListener(
        'keydown',
        function (event) {

          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {

            event.preventDefault();

            openLightbox(
              figure
            );

          }

        }
      );

    });


  document
    .querySelectorAll(
      '[data-close-lightbox]'
    )
    .forEach(function (button) {

      button.addEventListener(
        'click',
        closeLightbox
      );

    });


  if (lightbox) {

    lightbox.addEventListener(
      'click',
      function (event) {

        if (
          event.target === lightbox ||
          event.target.classList.contains(
            'lightbox-backdrop'
          )
        ) {

          closeLightbox();

        }

      }
    );

  }


  /* =========================================================
     KEYBOARD
     ========================================================= */

  document.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Escape'
      ) {

        if (
          lightbox &&
          !lightbox.hidden
        ) {

          closeLightbox();

        } else {

          closeMenu();

        }

      }

    }
  );


  /* =========================================================
     INITIALISE
     ========================================================= */

  show(
    location.hash.slice(1) ||
    defaultId,
    {
      skipScroll: true
    }
  );

})();