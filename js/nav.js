/* Nav behaviour (B103, B109):
   1. Glass: the bar is light glass at the very top of the page and deepens to full frosted glass once scrolled
      (.is-top on #mainNav; with no JS the glass is simply always on).
   2. Particles follow the page: sets --particle-opacity (1 at the top, 0.45 past the hero).
   3. Phone menu: closes after a link tap, an outside tap or Esc.
   4. Scrollspy: the link for the section in view gets .active (gold with a small bar) and aria-current. A section
      counts as "in view" once its top has passed 40% of the way down the screen; at the very bottom the last one wins,
      because the short last section can never reach that line. */
(function () {
    var nav = document.getElementById('mainNav');
    if (!nav) { return; }

    var links = [];
    nav.querySelectorAll('a.nav-link[href^="#"]').forEach(function (link) {
        var target = document.getElementById(link.getAttribute('href').slice(1));
        if (target) { links.push({ link: link, target: target }); }
    });

    var ticking = false;

    /* The phone menu closes after a link is tapped, on a tap outside it and on Esc (B113). Bootstrap does not close it
       for same-page links, so it used to stay open over the content. */
    var collapse = document.getElementById('navbarResponsive');
    var toggler = nav.querySelector('.navbar-toggler');

    function closeMenu(returnFocus) {
        if (!collapse || !collapse.classList.contains('show') || !window.bootstrap) { return false; }
        window.bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false }).hide();
        if (returnFocus && toggler) { toggler.focus(); }
        return true;
    }

    /* A tapped menu link hides itself with the menu, which would drop keyboard focus onto <body>; focus moves to the
       section the link points at instead (B123). */
    nav.querySelectorAll('.navbar-nav a').forEach(function (a) {
        a.addEventListener('click', function () {
            var wasOpen = collapse && collapse.classList.contains('show');
            closeMenu(false);
            if (!wasOpen) { return; }
            var href = a.getAttribute('href') || '';
            var target = href.charAt(0) === '#' ? document.getElementById(href.slice(1)) : null;
            if (target) {
                if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
                target.focus({ preventScroll: true });
            }
        });
    });
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) { closeMenu(false); }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && closeMenu(true)) { e.preventDefault(); }
    });

    var canvas = document.getElementById('particleCanvas');
    var lastOpacity = '';

    /* All the reads come first and the writes after, so a scroll frame forces at most one layout; the particle opacity
       is set on the canvas only (not the whole document) and only when its value changes (B129). */
    function update() {
        ticking = false;

        var y = window.scrollY;
        var vh = window.innerHeight;
        var line = vh * 0.4;
        var atBottom = y + vh >= document.documentElement.scrollHeight - 2;
        var current = links.length ? links[0] : null;

        links.forEach(function (item) {
            if (item.target.getBoundingClientRect().top <= line) { current = item; }
        });
        if (atBottom && links.length) { current = links[links.length - 1]; }

        /* The particle field eases down to 45% as the hero scrolls away, so text and card videos win; it returns at the
           top (B111). Two decimals are plenty, and it stops changing once the hero is gone. */
        var opacity = (1 - 0.55 * Math.min(1, y / (vh * 0.8))).toFixed(2);

        nav.classList.toggle('is-top', y <= 8);
        document.documentElement.classList.toggle('is-scrolled', y > 8);   /* hides the hero scroll cue (B110) */

        if (canvas && opacity !== lastOpacity) {
            lastOpacity = opacity;
            canvas.style.setProperty('--particle-opacity', opacity);
        }

        links.forEach(function (item) {
            var on = item === current;
            item.link.classList.toggle('active', on);
            if (on) { item.link.setAttribute('aria-current', 'location'); } else { item.link.removeAttribute('aria-current'); }
        });
    }

    function request() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
})();
