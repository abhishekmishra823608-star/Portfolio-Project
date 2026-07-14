/* ============================================================
   Abhishek Mishra — Portfolio
   script.js
   1. Footer year
   2. Sticky navbar + mobile menu
   3. Active nav-link highlighting on scroll
   4. Typing animation (hero role)
   5. Skill bar animation (on view)
   6. Scroll reveal (IntersectionObserver)
   7. Scroll-to-top button
   8. Dark / light theme toggle (persisted)
   9. Contact form validation
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Sticky navbar + mobile menu ---------- */
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function onScrollNavbar() {
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNavbar, { passive: true });
  onScrollNavbar();

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. Active nav-link highlighting on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id], .hero'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));

  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach(function (s) { navObserver.observe(s); });

  /* ---------- 4. Typing animation (hero role) ---------- */
  var roleEl = document.getElementById('typedRole');
  var roles = [
    'B.Tech CSE Student',
    'Frontend Developer',
    'AI Enthusiast'
  ];

  function typeLoop() {
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    roleEl.innerHTML = '<span class="typed-text"></span><span class="cursor">&nbsp;</span>';
    var textSpan = roleEl.querySelector('.typed-text');

    function tick() {
      var current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, 1500);
        }
        return setTimeout(tick, 65);
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          return setTimeout(tick, 300);
        }
        return setTimeout(tick, 35);
      }
    }
    tick();
  }
  if (roleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typeLoop();
  } else if (roleEl) {
    roleEl.textContent = roles.join(' · ');
  }

  /* ---------- 5. Skill bar animation (on view) ---------- */
  var skillCards = document.querySelectorAll('.skill-card');
  var skillObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        var target = parseInt(card.getAttribute('data-skill'), 10) || 0;
        var fill = card.querySelector('.bar-fill');
        var pct = card.querySelector('.pct');

        requestAnimationFrame(function () {
          fill.style.width = target + '%';
        });

        var start = null;
        var duration = 1200;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          pct.textContent = Math.round(progress * target) + '%';
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);

        obs.unobserve(card);
      });
    },
    { threshold: 0.35 }
  );
  skillCards.forEach(function (c) { skillObserver.observe(c); });

  /* ---------- 6. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- 7. Scroll-to-top button ---------- */
  var scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener(
    'scroll',
    function () {
      scrollTopBtn.classList.toggle('show', window.scrollY > 480);
    },
    { passive: true }
  );
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 8. Dark / light theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var htmlEl = document.documentElement;
  var STORAGE_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  themeToggle.addEventListener('click', function () {
    var current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable */ }
  });

  /* ---------- 9. Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  var validators = {
    name: function (v) {
      return v.trim().length >= 2 ? '' : 'Please enter your name (2+ characters).';
    },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    subject: function (v) {
      return v.trim().length >= 3 ? '' : 'Subject should be at least 3 characters.';
    },
    message: function (v) {
      return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.';
    }
  };

  function validateField(input) {
    var fieldWrap = document.getElementById('field-' + input.name);
    var errorEl = fieldWrap.querySelector('.error-msg');
    var message = validators[input.name] ? validators[input.name](input.value) : '';

    fieldWrap.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  form.querySelectorAll('input, textarea').forEach(function (input) {
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      var fieldWrap = document.getElementById('field-' + input.name);
      if (fieldWrap.classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
    var allValid = inputs.reduce(function (ok, input) {
      var fieldValid = validateField(input);
      return ok && fieldValid;
    }, true);

    if (!allValid) {
      formStatus.className = 'form-status show';
      formStatus.style.background = 'rgba(255,97,97,0.12)';
      formStatus.style.color = 'var(--danger)';
      formStatus.style.border = '1px solid rgba(255,97,97,0.3)';
      formStatus.textContent = 'Please fix the highlighted fields before sending.';
      return;
    }

    // No backend is wired up — simulate a successful send.
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(function () {
      formStatus.className = 'form-status show success';
      formStatus.textContent = 'Thanks! Your message has been received — I\'ll get back to you soon.';
      form.reset();
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }, 900);
  });

})();