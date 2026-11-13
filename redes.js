/* Interacciones y movimiento seguros para la página autónoma: La conversación continúa en redes.. */
(() => {
  const body = document.body;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const theme = document.querySelector('#contrast-toggle');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Cerrar' : 'Menú';
  });
  if (theme) {
    try { if (localStorage.getItem('otra-forma-de-mirar-theme') === 'dark') body.classList.add('dark-mode'); } catch (_) {}
    const paint = () => { const dark = body.classList.contains('dark-mode'); theme.textContent = dark ? 'Modo claro' : 'Modo oscuro'; theme.setAttribute('aria-pressed', String(dark)); };
    paint();
    theme.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      try { localStorage.setItem('otra-forma-de-mirar-theme', body.classList.contains('dark-mode') ? 'dark' : 'light'); } catch (_) {}
      paint();
    });
  }

  // Consejos breves: muestra el texto asociado al botón y permite cerrarlo de nuevo.
  document.querySelectorAll('.guide-more').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.parentElement.querySelector('.guide-answer');
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      button.classList.toggle('is-open', !open);
      if (answer) { answer.textContent = open ? '' : (button.dataset.guideAnswer || ''); answer.classList.toggle('is-visible', !open); }
    });
  });

  // Paneles de contenido ampliado: reversible, con transición y cierre de paneles hermanos.
  const closeTimers = new WeakMap();
  document.querySelectorAll('.content-expand-button').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    const cardScope = button.closest('.article-card, .expert-card, .interview-card, .recommendations-grid article, .intro');
    const closePanel = other => {
      const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
      if (!otherPanel) return;
      other.setAttribute('aria-expanded', 'false'); other.classList.remove('is-open');
      const label = other.querySelector('span:last-child'); if (label) label.textContent = '+';
      otherPanel.classList.remove('is-open'); otherPanel.classList.add('is-closing');
      const old = closeTimers.get(otherPanel); if (old) clearTimeout(old);
      closeTimers.set(otherPanel, setTimeout(() => { otherPanel.hidden = true; otherPanel.classList.remove('is-closing'); closeTimers.delete(otherPanel); }, 460));
    };
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      if (!open && cardScope) cardScope.querySelectorAll('.content-expand-button[aria-expanded="true"]').forEach(closePanel);
      button.setAttribute('aria-expanded', String(!open)); button.classList.toggle('is-open', !open);
      const label = button.querySelector('span:last-child'); if (label) label.textContent = open ? '+' : '−';
      const old = closeTimers.get(panel); if (old) clearTimeout(old); closeTimers.delete(panel);
      if (open) {
        panel.classList.remove('is-open'); panel.classList.add('is-closing');
        closeTimers.set(panel, setTimeout(() => { panel.hidden = true; panel.classList.remove('is-closing'); closeTimers.delete(panel); }, 460));
      } else {
        panel.classList.remove('is-closing'); panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add('is-open'));
      }
    });
  });

  // Colecciones (personajes y minijuegos): despliegue con texto e icono sincronizados.
  document.querySelectorAll('.section-collection-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      const title = button.querySelector('strong');
      if (title && panel.id === 'characters-panel') title.textContent = open ? 'Ocultar personajes' : 'Ver los cinco personajes';
      if (title && panel.id === 'minigames-panel') title.textContent = open ? 'Ocultar minijuegos' : 'Abrir minijuegos';
      button.querySelector('.collection-toggle-icon')?.classList.toggle('is-open', open);
      if (open) { panel.hidden = false; panel.classList.remove('is-closing'); requestAnimationFrame(() => panel.classList.add('is-open')); }
      else {
        panel.classList.remove('is-open'); panel.classList.add('is-closing');
        setTimeout(() => { if (button.getAttribute('aria-expanded') === 'false') { panel.hidden = true; panel.classList.remove('is-closing'); } }, 480);
      }
    });
  });

  // Filtros de notas (las categorías usan los mismos valores que data-category).
  document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach(item => item.classList.toggle('active', item === button));
      const filter = button.dataset.filter;
      const cards = [...document.querySelectorAll('.article-card')];
      cards.forEach(card => { card.hidden = !(filter === 'todos' || card.dataset.category === filter); });
      document.querySelector('.article-grid')?.classList.toggle('single-result', cards.filter(card => !card.hidden).length === 1);
    });
  });

  // Botones de ideas y créditos con panel asociado.
  document.querySelectorAll('.hook-button').forEach(button => {
    button.addEventListener('click', () => {
      const message = button.parentElement.querySelector('.hook-message');
      const open = button.classList.toggle('is-open');
      if (message) { message.textContent = open ? (button.dataset.hookMessage || '') : ''; message.classList.toggle('is-visible', open); }
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.video-credits-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open)); button.classList.toggle('is-open', open); panel.hidden = !open;
    });
  });

  const section = document.querySelector('main > section');
  if (section && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const layer = document.createElement('div'); layer.className = 'ambient-particles'; layer.setAttribute('aria-hidden','true');
    layer.innerHTML = '<span>✦</span><span>•</span><span>✧</span><span>•</span><span>✦</span><span>✧</span><span>•</span><span>✦</span>'; section.prepend(layer);
  }
  document.querySelectorAll('[data-close="true"]').forEach(el => el.addEventListener('click', () => el.closest('.modal')?.classList.remove('open')));
})();
