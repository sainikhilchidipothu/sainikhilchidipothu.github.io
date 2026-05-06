(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setCurrentYear();
    initMobileNav();
    initScrollSpy();
    initRevealOnScroll();
    initTerminal();
  }

  function setCurrentYear() {
    var el = document.getElementById('currentYear');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initMobileNav() {
    var toggle = document.querySelector('.nav__toggle');
    var links  = document.querySelector('.nav__links');
    if (!toggle || !links) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('nav__links--open', open);
      var icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list', !open);
        icon.classList.toggle('bi-x', open);
      }
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.nav__link');
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main section[id]')
    );
    if (!sections.length) return;

    var ticking = false;
    var lastY = 0;

    function update() {
      var headerH = document.querySelector('.site-header').offsetHeight || 72;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        var top = sections[i].offsetTop - headerH - 80;
        if (lastY >= top) current = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      lastY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  function initRevealOnScroll() {
    var targets = document.querySelectorAll(
      '#about .about, ' +
      '#about .section__head, ' +
      '#projects .section__head, ' +
      '#projects .project, ' +
      '#skills .section__head, ' +
      '#skills .skill-group, ' +
      '#skills .coursework, ' +
      '#contact .section__head, ' +
      '#contact .contact__card, ' +
      '#contact .contact__primary, ' +
      '#contact .contact__primary'
    );
    targets.forEach(function (t) { t.classList.add('reveal'); });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    targets.forEach(function (t) { io.observe(t); });
  }

  function initTerminal() {
    var fab    = document.getElementById('terminalFab');
    var term   = document.getElementById('terminal');
    var body   = document.getElementById('terminalBody');
    var input  = document.getElementById('terminalInput');
    var close  = document.getElementById('terminalCloseBtn');
    if (!fab || !term || !body || !input || !close) return;

    var promptEl  = null;
    var history   = [];
    var historyIx = -1;

    function open() {
      term.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          term.classList.add('terminal--open');
        });
      });
      fab.setAttribute('aria-expanded', 'true');
      setTimeout(function () { input.focus(); }, 250);
    }

    function close_() {
      term.classList.remove('terminal--open');
      fab.setAttribute('aria-expanded', 'false');
      setTimeout(function () {
        if (!term.classList.contains('terminal--open')) term.hidden = true;
      }, 320);
    }

    function newPrompt() {
      var p = document.createElement('p');
      p.innerHTML = '<span class="cmd-prompt">sai@portfolio</span> <span class="cmd-path">~</span> % <span class="cmd-line"></span><span class="blink"></span>';
      body.appendChild(p);
      promptEl = p;
      body.scrollTop = body.scrollHeight;
    }

    function print(html) {
      var wrap = document.createElement('div');
      wrap.innerHTML = html;
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
      newPrompt();
    }

    var COMMANDS = {
      help: function () {
        return '<p>Use one of these:</p>' +
               '<pre>about    who I am\nwork     projects worth opening\nstack    tools I use\ncontact  email + links\nresume   open résumé\nclear    clear the window\nclose    close this</pre>' +
               '<p class="terminal__hint">Type a command and press Enter.</p>';
      },

      about: function () {
        return '<p>I’m Sai. I build ML and software projects, mostly around applied AI, computer vision, and making models more efficient.</p>' +
               '<p>I care about clear code, useful outputs, and being able to explain why something works, or why it does not.</p>';
      },

      work: function () {
        return '<p>I’d start with these:</p>' +
               '<p><strong>SparseGPT</strong>: LLaMA-7B pruning experiments. Finished, measured, and written up in code. <a href="https://github.com/sainikhilchidipothu/CAP6614-Current-Topics-in-Machine-Learning" target="_blank" rel="noopener">repo</a></p>' +
               '<p><strong>SkyEye</strong>: aerial object detection with YOLOv8, tuned for fast inference. <a href="https://github.com/UmaimaKhan01/SkyEye-Aerial-Object-Detection-using-Yolo" target="_blank" rel="noopener">repo</a></p>' +
               '<p><strong>What-TO-DO</strong>: a small React planner I actually use to think through tasks. <a href="https://what-to-do-nu.vercel.app/" target="_blank" rel="noopener">live</a></p>';
      },

      stack: function () {
        return '<p>Usually Python for ML, React when something needs a usable interface, and Docker/AWS when I need the setup to be repeatable.</p>' +
               '<p>Tools I come back to: PyTorch, TensorFlow/Keras, scikit-learn, YOLOv8, Hugging Face, Flask, FastAPI, React, Tailwind, PostgreSQL, Pandas, and NumPy.</p>';
      },

      contact: function () {
        return '<p>Email is best: <a href="mailto:ch.sainikhil01@gmail.com">ch.sainikhil01@gmail.com</a></p>' +
               '<p>Also here: <a href="https://www.linkedin.com/in/sainikhilchidipothu/" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://github.com/sainikhilchidipothu" target="_blank" rel="noopener">GitHub</a></p>';
      },

      resume: function () {
        window.open('https://drive.google.com/file/d/1s1TNSzTLQO9Ujc5g_JqdLFS45D3DFoRa/view?usp=sharing', '_blank', 'noopener');
        return '<p>Opening résumé. If nothing opens, your browser probably blocked the new tab. The résumé button on the page works too.</p>';
      },

      ls: function () {
        return '<pre>about  work  stack  contact  resume</pre>';
      },

      pwd: function () {
        return '<pre>/portfolio/sai</pre>';
      },

      clear: function () {
        body.innerHTML = '';
        return '__skip__';
      },

      close: function () {
        close_();
        return '__skip__';
      },

      hi: function () {
        return '<p>Hey. Try <strong>work</strong> if you want the useful stuff, or <strong>contact</strong> if you just need a way to reach me.</p>';
      },

      thanks: function () {
        return '<p>Of course.</p>';
      }
    };

    COMMANDS.hello = COMMANDS.hi;
    COMMANDS.whoami = COMMANDS.about;
    COMMANDS.projects = COMMANDS.work;
    COMMANDS.skills = COMMANDS.stack;
    COMMANDS.email = COMMANDS.contact;
    COMMANDS.linkedin = COMMANDS.contact;
    COMMANDS.github = COMMANDS.contact;
    COMMANDS['thank you'] = COMMANDS.thanks;

    function run(cmd) {
      var key = cmd.toLowerCase().trim();
      var fn  = COMMANDS[key];
      var output = fn
        ? fn()
        : '<p>I do not have that one here. Try <strong>help</strong> to see the commands.</p>';

      if (output === '__skip__') {
        if (key === 'clear') newPrompt();
        return;
      }
      print(output);
    }

    fab.addEventListener('click', open);
    close.addEventListener('click', close_);
    term.addEventListener('click', function () { input.focus(); });

    body.addEventListener('click', function () { input.focus(); });

    function submitCommand(cmd) {
      if (!cmd) return;
      if (promptEl) {
        var line = promptEl.querySelector('.cmd-line');
        var blink = promptEl.querySelector('.blink');
        if (line) line.textContent = cmd;
        if (blink) blink.remove();
      }
      history.unshift(cmd);
      historyIx = -1;
      input.value = '';
      run(cmd);
    }

    input.addEventListener('input', function () {
      if (!promptEl) return;
      var line = promptEl.querySelector('.cmd-line');
      if (line) line.textContent = input.value;
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var cmd = input.value.trim();
        if (cmd) {
          submitCommand(cmd);
        } else {
          newPrompt();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIx + 1 < history.length) {
          historyIx++;
          input.value = history[historyIx];
          updatePromptLine();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIx > 0) {
          historyIx--;
          input.value = history[historyIx];
        } else {
          historyIx = -1;
          input.value = '';
        }
        updatePromptLine();
      } else if (e.key === 'Escape') {
        close_();
      }
    });

    function updatePromptLine() {
      var line = promptEl && promptEl.querySelector('.cmd-line');
      if (line) line.textContent = input.value;
    }

    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      var isTypingField = tag === 'INPUT' || tag === 'TEXTAREA';
      if (e.key === '`' && term.hidden && !isTypingField) {
        e.preventDefault();
        open();
      }
    });

    newPrompt();
  }

})();
