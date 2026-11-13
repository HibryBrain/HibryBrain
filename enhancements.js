(() => {
  const preferenceKey = 'otra-forma-de-mirar-performance';
  const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let savedPreferences = {};
  try { savedPreferences = JSON.parse(localStorage.getItem(preferenceKey) || '{}'); } catch (_) {}
  const reduced = systemReduced || savedPreferences.reduceMotion === true;
  const navGroups = [...document.querySelectorAll('.main-nav .nav-group')];
  const nav = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  let settingsGear = null;
  let settingsPanel = null;
  let syncFloatingPanels = () => {};
  let syncMenuBackdrop = () => {};
  // One shared backdrop dims and blurs the page whenever the main menu is open.
  let menuBackdrop = document.querySelector('.mobile-menu-backdrop');
  const createdMenuBackdrop = !menuBackdrop;
  if (nav && menuToggle && !menuBackdrop) {
    menuBackdrop = document.createElement('button');
    menuBackdrop.type = 'button'; menuBackdrop.className = 'mobile-menu-backdrop';
    menuBackdrop.setAttribute('aria-label', 'Cerrar menú'); menuBackdrop.hidden = true;
    document.body.append(menuBackdrop);
  }
  if (nav && menuBackdrop) {
    syncMenuBackdrop = () => {
      const mobileOpen = nav.classList.contains('open');
      const groupOpen = navGroups.some(group => group.open);
      const active = mobileOpen || groupOpen;
      menuBackdrop.hidden = !active;
      document.body.classList.toggle('mobile-menu-open', mobileOpen);
      document.body.classList.toggle('navigation-overlay-open', active);
    };
    new MutationObserver(syncMenuBackdrop).observe(nav, { attributes: true, attributeFilter: ['class', 'open'], subtree: true });
    menuBackdrop.addEventListener('click', () => {
      if (window.matchMedia('(min-width: 761px)').matches) {
        navGroups.filter(group => group.open).forEach(group => animateGroup(group, false));
      } else if (createdMenuBackdrop && nav.classList.contains('open')) menuToggle.click();
    });
    syncMenuBackdrop();
  }

  const performanceSettings = () => {
    const qualityNames = { save: 'Ahorro', balanced: 'Equilibrado', full: 'Completo' };
    const settings = {
      quality: savedPreferences.quality || (systemReduced ? 'save' : 'balanced'),
      reduceMotion: savedPreferences.reduceMotion === true || systemReduced,
      particles: savedPreferences.particles !== false,
      effects: savedPreferences.effects !== false,
      shadows: savedPreferences.shadows !== false
    };
    const apply = () => {
      document.body.classList.remove('performance-save', 'performance-balanced', 'performance-full', 'user-reduced-motion', 'disable-particles', 'disable-effects', 'disable-shadows');
      document.body.classList.add(`performance-${settings.quality}`);
      if (settings.reduceMotion) document.body.classList.add('user-reduced-motion');
      if (!settings.particles) document.body.classList.add('disable-particles');
      if (!settings.effects) document.body.classList.add('disable-effects');
      if (!settings.shadows) document.body.classList.add('disable-shadows');
      try { localStorage.setItem(preferenceKey, JSON.stringify(settings)); } catch (_) {}
      const quality = document.getElementById('performance-quality');
      const motion = document.getElementById('performance-reduce-motion');
      const particles = document.getElementById('performance-particles');
      const effects = document.getElementById('performance-effects');
      const shadows = document.getElementById('performance-shadows');
      const status = document.getElementById('performance-status');
      if (quality) quality.value = settings.quality;
      if (motion) motion.checked = settings.reduceMotion;
      if (particles) particles.checked = settings.particles;
      if (effects) effects.checked = settings.effects;
      if (shadows) shadows.checked = settings.shadows;
      if (status) status.textContent = `${qualityNames[settings.quality]}${settings.reduceMotion ? ' · movimiento reducido' : ''}`;
    };
    const gear = document.createElement('button');
    gear.type = 'button'; gear.className = 'performance-gear'; gear.setAttribute('aria-label', 'Configurar rendimiento visual');
    gear.setAttribute('aria-expanded', 'false'); gear.innerHTML = '<span class="performance-gear-icon" aria-hidden="true">⚙</span>';  
    const panel = document.createElement('section');
    panel.className = 'performance-panel'; panel.hidden = true; panel.setAttribute('aria-labelledby', 'performance-title');
    panel.innerHTML = `<div class="performance-panel-heading"><div><p class="performance-kicker">Rendimiento</p><h2 id="performance-title">Ajusta la experiencia</h2></div><button type="button" class="performance-close" aria-label="Cerrar configuración">×</button></div><p class="performance-help">Reduce los efectos visuales si tu computador o teléfono es lento. Las tarjetas y el contenido siempre permanecerán visibles.</p><label class="performance-field" for="performance-quality"><span><strong>Perfil visual</strong><small>Un ajuste rápido para tu dispositivo</small></span><select id="performance-quality"><option value="save">Ahorro</option><option value="balanced">Equilibrado</option><option value="full">Completo</option></select></label><label class="performance-check"><input id="performance-particles" type="checkbox"><span><strong>Partículas decorativas</strong><small>Estrellas y puntos flotantes</small></span></label><label class="performance-check"><input id="performance-effects" type="checkbox"><span><strong>Blur y efectos</strong><small>Desenfoque, transparencias y brillo</small></span></label><label class="performance-check"><input id="performance-shadows" type="checkbox"><span><strong>Sombras</strong><small>Profundidad visual de tarjetas y botones</small></span></label><label class="performance-check"><input id="performance-reduce-motion" type="checkbox"><span><strong>Reducir movimiento</strong><small>Desactiva animaciones intensas y flotaciones</small></span></label><p class="performance-status" id="performance-status" aria-live="polite"></p>`;
    settingsGear = gear; settingsPanel = panel;
    document.body.append(gear, panel);
    const close = () => { panel.hidden = true; gear.setAttribute('aria-expanded', 'false'); syncFloatingPanels(); };
    gear.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; gear.setAttribute('aria-expanded', String(open)); document.querySelector('.share-qr-dialog')?.setAttribute('hidden', ''); document.querySelector('.share-qr-button')?.setAttribute('aria-expanded', 'false'); document.querySelector('.social-links-panel')?.setAttribute('hidden', ''); document.querySelector('.social-links-button')?.setAttribute('aria-expanded', 'false'); syncFloatingPanels(); });
    panel.querySelector('.performance-close').addEventListener('click', close);
    panel.querySelector('#performance-quality').addEventListener('change', event => {
      settings.quality = event.target.value;
      const preset = settings.quality;
      settings.particles = preset !== 'save'; settings.effects = preset !== 'save'; settings.shadows = preset !== 'save';
      settings.reduceMotion = preset === 'save' || systemReduced;
      apply();
    });
    panel.querySelector('#performance-particles').addEventListener('change', event => { settings.particles = event.target.checked; apply(); });
    panel.querySelector('#performance-effects').addEventListener('change', event => { settings.effects = event.target.checked; apply(); });
    panel.querySelector('#performance-shadows').addEventListener('change', event => { settings.shadows = event.target.checked; apply(); });
    panel.querySelector('#performance-reduce-motion').addEventListener('change', event => { settings.reduceMotion = event.target.checked; apply(); });
    document.addEventListener('click', event => { if (!panel.hidden && !panel.contains(event.target) && !gear.contains(event.target) && !event.target.closest('.floating-actions-backdrop')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    apply();
  };
  performanceSettings();

  const animateGroup = (group, opening) => {
    const summary = group.querySelector(':scope > summary');
    const panel = group.querySelector(':scope > .nav-submenu');
    if (!summary || !panel || group.dataset.animating === 'true') return Promise.resolve();
    group.dataset.animating = 'true';
    if (opening) {
      panel.style.height = '0px';
      panel.style.overflow = 'hidden';
      panel.style.opacity = '0';
      group.open = true;
      summary.setAttribute('aria-expanded', 'true');
      const targetHeight = panel.scrollHeight;
      const animation = (reduced || document.body.classList.contains('user-reduced-motion') || document.body.classList.contains('performance-save')) ? null : panel.animate([
        { height: '0px', opacity: 0, transform: 'translateY(-8px) scale(.98)' },
        { height: `${targetHeight}px`, opacity: 1, transform: 'translateY(0) scale(1)' }
      ], { duration: 270, easing: 'cubic-bezier(.2,.8,.2,1)' });
      if (!animation) {
        panel.style.height = ''; panel.style.overflow = ''; panel.style.opacity = '';
        group.dataset.animating = 'false'; return Promise.resolve();
      }
      return animation.finished.catch(() => {}).then(() => {
        panel.style.height = ''; panel.style.overflow = ''; panel.style.opacity = '';
        group.dataset.animating = 'false';
      });
    }
    const height = panel.getBoundingClientRect().height;
    const animation = (reduced || document.body.classList.contains('user-reduced-motion') || document.body.classList.contains('performance-save')) ? null : panel.animate([
      { height: `${height}px`, opacity: 1, transform: 'translateY(0) scale(1)' },
      { height: '0px', opacity: 0, transform: 'translateY(-7px) scale(.98)' }
    ], { duration: 220, easing: 'cubic-bezier(.4,0,.2,1)' });
    if (!animation) {
      group.open = false; summary.setAttribute('aria-expanded', 'false');
      panel.style.height = ''; panel.style.overflow = ''; panel.style.opacity = '';
      group.dataset.animating = 'false'; return Promise.resolve();
    }
    return animation.finished.catch(() => {}).then(() => {
      group.open = false; summary.setAttribute('aria-expanded', 'false');
      panel.style.height = ''; panel.style.overflow = ''; panel.style.opacity = '';
      group.dataset.animating = 'false';
    });
  };

  navGroups.forEach(group => {
    const summary = group.querySelector(':scope > summary');
    if (!summary) return;
    group.dataset.animating = 'false';
    summary.setAttribute('aria-expanded', String(group.open));
    summary.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation();
      const opening = !group.open;
      // Close sibling panels synchronously so touch/click timing cannot cancel the requested menu.
      navGroups.filter(other => other !== group && other.open).forEach(other => {
        const otherPanel = other.querySelector(':scope > .nav-submenu');
        other.open = false; other.dataset.animating = 'false';
        other.querySelector(':scope > summary')?.setAttribute('aria-expanded', 'false');
        if (otherPanel) { otherPanel.style.height = ''; otherPanel.style.overflow = ''; otherPanel.style.opacity = ''; }
      });
      group.dataset.animating = 'false';
      group.open = opening;
      summary.setAttribute('aria-expanded', String(opening));
      const panel = group.querySelector(':scope > .nav-submenu');
      if (panel) { panel.style.height = ''; panel.style.overflow = ''; panel.style.opacity = ''; }
    }, { capture: true });
  });

  // Un único manejador en fase de captura evita el doble toque provocado por los
  // manejadores locales de cada página. El botón completo es siempre táctil.
  if (menuToggle && nav) menuToggle.addEventListener('click', event => {
    event.preventDefault(); event.stopImmediatePropagation();
    const opening = !nav.classList.contains('open');
    nav.classList.toggle('open', opening);
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.textContent = opening ? 'Cerrar' : 'Menú';
    if (!opening) navGroups.filter(group => group.open).forEach(group => {
      group.open = false; group.querySelector(':scope > summary')?.setAttribute('aria-expanded', 'false');
    });
    syncMenuBackdrop();
  }, true);
  document.addEventListener('click', event => {
    if (event.target.closest('.nav-group')) return;
    if (!nav || nav.contains(event.target) || menuToggle?.contains(event.target) || event.target.closest('.mobile-menu-backdrop')) return;
    navGroups.filter(group => group.open).forEach(group => animateGroup(group, false));
    if (nav.classList.contains('open') && menuToggle) menuToggle.click();
  });

  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
    navGroups.filter(group => group.open).forEach(group => animateGroup(group, false));
    if (nav?.classList.contains('open') && menuToggle) menuToggle.click();
  }));

  // Haptics only run from an explicit visitor activation; browsers may disable this API.
  if ('vibrate' in navigator) document.addEventListener('click', event => {
    if (!event.isTrusted) return;
    const target = event.target.closest('button, a, summary, [role="button"]');
    if (!target) return;
    let pattern = [8];
    if (target.matches('.menu-toggle, .nav-group > summary')) pattern = [7, 12, 7];
    else if (target.matches('.social-links-button, .social-links-panel a')) pattern = [6, 8, 12];
    else if (target.matches('.share-qr-button, .share-copy-link')) pattern = [13];
    else if (target.matches('.performance-gear, .performance-close')) pattern = [5, 7, 11];
    else if (target.matches('.contrast-button, .language-toggle')) pattern = [9, 6, 9];
    else if (target.matches('a')) pattern = [6, 9, 6];
    try { navigator.vibrate(pattern); } catch (_) {}
  }, { capture: true, passive: true });

  // Independent share button beside the persistent settings gear.
  const share = document.createElement('button');
  share.type = 'button'; share.className = 'share-qr-button'; share.setAttribute('aria-label', 'Compartir esta página con código QR');
  share.setAttribute('aria-expanded', 'false'); share.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2"/></svg>';
  const qrDialog = document.createElement('div');
  qrDialog.className = 'share-qr-dialog'; qrDialog.hidden = true; qrDialog.setAttribute('role', 'dialog'); qrDialog.setAttribute('aria-label', 'Compartir esta página');
  qrDialog.innerHTML = '<button type="button" class="share-qr-close" aria-label="Cerrar código QR">×</button><h2>Comparte esta página</h2><p>Escanea el código para abrir el sitio.</p><img src="QR/QR.png" alt="Código QR para compartir Otra forma de mirar"><button type="button" class="share-copy-link">Copiar enlace</button><p class="share-copy-status" aria-live="polite"></p>';
  document.body.append(share, qrDialog);
  const closeQr = () => { qrDialog.hidden = true; share.setAttribute('aria-expanded', 'false'); syncFloatingPanels(); };
  share.addEventListener('click', () => {
    const open = qrDialog.hidden;
    if (settingsPanel) settingsPanel.hidden = true;
    settingsGear?.setAttribute('aria-expanded', 'false');
    document.querySelector('.social-links-panel')?.setAttribute('hidden', '');
    document.querySelector('.social-links-button')?.setAttribute('aria-expanded', 'false');
    qrDialog.hidden = !open; share.setAttribute('aria-expanded', String(open)); syncFloatingPanels();
  });
  qrDialog.querySelector('.share-qr-close').addEventListener('click', closeQr);
  qrDialog.querySelector('.share-copy-link').addEventListener('click', async () => {
    const status = qrDialog.querySelector('.share-copy-status');
    try { await navigator.clipboard.writeText(location.href); status.textContent = 'Enlace copiado.'; }
    catch (_) { status.textContent = location.href; }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeQr(); });
  const socialButton = document.createElement('button');
  socialButton.type = 'button'; socialButton.className = 'social-links-button';
  socialButton.setAttribute('aria-label', 'Abrir redes sociales'); socialButton.setAttribute('aria-expanded', 'false');
  socialButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 8v6m-3-3h6"/></svg>';
  const socialPanel = document.createElement('section');
  socialPanel.className = 'social-links-panel'; socialPanel.hidden = true;
  socialPanel.setAttribute('role', 'dialog'); socialPanel.setAttribute('aria-label', 'Nuestras redes sociales');
  socialPanel.innerHTML = '<button type="button" class="share-qr-close" aria-label="Cerrar redes sociales">×</button><h2>Encuéntranos en redes</h2><p>Sigue la conversación de Hybri Brain.</p><a href="https://www.facebook.com/profile.php?id=61594085487904" target="_blank" rel="noopener noreferrer"><img src="imagenes/facebook.png" alt="">Facebook<span class="social-link-dots" aria-hidden="true"><i></i><i></i><i></i></span></a><a href="https://www.instagram.com/hibrybrain/" target="_blank" rel="noopener noreferrer"><img src="imagenes/rere.png" alt="">Instagram<span class="social-link-dots" aria-hidden="true"><i></i><i></i><i></i></span></a><a href="https://www.tiktok.com/@hibrydbrain" target="_blank" rel="noopener noreferrer"><img src="imagenes/tik tok.png" alt="">TikTok<span class="social-link-dots" aria-hidden="true"><i></i><i></i><i></i></span></a>';
  document.body.append(socialButton, socialPanel);
  socialButton.addEventListener('click', () => {
    const open = socialPanel.hidden;
    if (settingsPanel) settingsPanel.hidden = true;
    settingsGear?.setAttribute('aria-expanded', 'false');
    qrDialog.hidden = true; share.setAttribute('aria-expanded', 'false');
    socialPanel.hidden = !open; socialButton.setAttribute('aria-expanded', String(open)); syncFloatingPanels();
  });
  socialPanel.querySelector('.share-qr-close').addEventListener('click', () => { socialPanel.hidden = true; socialButton.setAttribute('aria-expanded', 'false'); syncFloatingPanels(); });
  const actionBackdrop = document.createElement('button');
  actionBackdrop.type = 'button'; actionBackdrop.className = 'floating-actions-backdrop';
  actionBackdrop.setAttribute('aria-label', 'Cerrar panel abierto'); actionBackdrop.hidden = true;
  document.body.append(actionBackdrop);
  const closeFloatingPanels = () => {
    qrDialog.hidden = true; socialPanel.hidden = true;
    if (settingsPanel) settingsPanel.hidden = true;
    share.setAttribute('aria-expanded', 'false'); socialButton.setAttribute('aria-expanded', 'false'); settingsGear?.setAttribute('aria-expanded', 'false');
    syncFloatingPanels();
  };
  syncFloatingPanels = () => {
    const open = !qrDialog.hidden || !socialPanel.hidden || Boolean(settingsPanel && !settingsPanel.hidden);
    actionBackdrop.hidden = !open;
    document.body.classList.toggle('floating-panel-open', open);
  };
  actionBackdrop.addEventListener('click', closeFloatingPanels);

  // En móvil, las tres acciones flotantes se agrupan bajo un único botón
  // arrastrable. En escritorio el contenedor usa display:contents y no cambia
  // ninguna posición ni comportamiento existente.
  const mobileActions = document.createElement('div');
  mobileActions.className = 'mobile-actions-menu';
  mobileActions.innerHTML = '<button type="button" class="mobile-actions-toggle" aria-label="Abrir acciones rápidas" aria-expanded="false"><span aria-hidden="true">✦</span></button>';
  const mobileActionsToggle = mobileActions.querySelector('.mobile-actions-toggle');
  document.body.append(mobileActions);
  mobileActions.append(share, socialButton, settingsGear);

  let mobileActionsOpen = false;
  const setMobileActionsOpen = open => {
    mobileActionsOpen = open;
    mobileActions.classList.toggle('is-open', open);
    mobileActionsToggle.setAttribute('aria-expanded', String(open));
    mobileActionsToggle.setAttribute('aria-label', open ? 'Cerrar acciones rápidas' : 'Abrir acciones rápidas');
  };
  mobileActionsToggle.addEventListener('click', event => {
    if (mobileActionsToggle.dataset.dragged === 'true') {
      mobileActionsToggle.dataset.dragged = 'false';
      return;
    }
    setMobileActionsOpen(!mobileActionsOpen);
  });

  let draggingActions = false;
  let actionDragMoved = false;
  let actionPointerId = null;
  let actionStartX = 0;
  let actionStartY = 0;
  let actionOriginX = 0;
  let actionOriginY = 0;
  const clampActions = (x, y) => {
    const rect = mobileActions.getBoundingClientRect();
    const maxX = Math.max(8, window.innerWidth - rect.width - 8);
    const maxY = Math.max(8, window.innerHeight - rect.height - 8);
    return { x: Math.min(maxX, Math.max(8, x)), y: Math.min(maxY, Math.max(8, y)) };
  };
  mobileActionsToggle.addEventListener('pointerdown', event => {
    if (window.matchMedia('(min-width: 761px)').matches) return;
    draggingActions = true; actionDragMoved = false; actionPointerId = event.pointerId;
    actionStartX = event.clientX; actionStartY = event.clientY;
    const rect = mobileActions.getBoundingClientRect(); actionOriginX = rect.left; actionOriginY = rect.top;
    mobileActionsToggle.setPointerCapture?.(event.pointerId);
  });
  mobileActionsToggle.addEventListener('pointermove', event => {
    if (!draggingActions || event.pointerId !== actionPointerId) return;
    const dx = event.clientX - actionStartX, dy = event.clientY - actionStartY;
    if (Math.hypot(dx, dy) > 5) actionDragMoved = true;
    if (!actionDragMoved) return;
    const next = clampActions(actionOriginX + dx, actionOriginY + dy);
    mobileActions.style.left = `${next.x}px`; mobileActions.style.top = `${next.y}px`;
    mobileActions.style.right = 'auto'; mobileActions.style.bottom = 'auto';
    mobileActionsToggle.dataset.dragged = 'true';
    event.preventDefault();
  }, { passive: false });
  const finishActionDrag = event => {
    if (!draggingActions || (event && event.pointerId !== actionPointerId)) return;
    draggingActions = false; actionPointerId = null;
    if (actionDragMoved) {
      try { localStorage.setItem('otra-forma-de-mirar-mobile-actions-position', JSON.stringify({ left: mobileActions.style.left, top: mobileActions.style.top })); } catch (_) {}
    }
  };
  mobileActionsToggle.addEventListener('pointerup', finishActionDrag);
  mobileActionsToggle.addEventListener('pointercancel', finishActionDrag);
  try {
    const saved = JSON.parse(localStorage.getItem('otra-forma-de-mirar-mobile-actions-position') || 'null');
    if (saved?.left && saved?.top) { mobileActions.style.left = saved.left; mobileActions.style.top = saved.top; mobileActions.style.right = 'auto'; mobileActions.style.bottom = 'auto'; }
  } catch (_) {}
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 761px)').matches) setMobileActionsOpen(false);
    else if (mobileActions.style.left && mobileActions.style.top) {
      const rect = mobileActions.getBoundingClientRect(), next = clampActions(rect.left, rect.top);
      mobileActions.style.left = `${next.x}px`; mobileActions.style.top = `${next.y}px`;
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeFloatingPanels(); });

  // Local Spanish/English switch: translations are packaged with the site and work offline.
  if (nav) {
    const languageButton = document.createElement('button');
    languageButton.type = 'button'; languageButton.className = 'contrast-button language-toggle';
    languageButton.setAttribute('aria-label', 'Cambiar idioma del sitio a inglés');
    const themeButton = nav.querySelector('#contrast-toggle');
    nav.insertBefore(languageButton, themeButton || null);
    const dictionary = Object.assign({}, window.EN_TRANSLATIONS || {}, window.EXTRA_EN_TRANSLATIONS || {});
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    let english = false;
    try { english = localStorage.getItem('otra-forma-de-mirar-language') === 'en'; } catch (_) {}
    const normalize = value => value.replace(/\s+/g, ' ').trim();
    const writeText = node => {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      let original = originalText.get(node);
      const current = node.nodeValue;
      const knownTranslation = dictionary[normalize(original)];
      if (current !== original && (!knownTranslation || current !== knownTranslation)) {
        original = current; originalText.set(node, original);
      }
      if (!english) { if (node.nodeValue !== original) node.nodeValue = original; return; }
      const clean = normalize(original);
      let translated = dictionary[clean];
      if (!translated && english && clean.length > 2) {
        translated = Object.keys(dictionary).filter(key => key.length > 3 && clean.includes(key)).sort((a,b) => b.length-a.length).reduce((value, key) => value.replaceAll(key, dictionary[key]), clean);
        if (translated === clean) translated = null;
      }
      if (!translated) return;
      const leading = original.match(/^\s*/)?.[0] || '', trailing = original.match(/\s*$/)?.[0] || '';
      const next = leading + translated + trailing;
      if (node.nodeValue !== next) node.nodeValue = next;
    };
    const translatableAttributes = ['aria-label','alt','title','placeholder','value'];
    const scanElement = element => {
      if (element.nodeType !== 1) return;
      translatableAttributes.forEach(name => {
        if (!element.hasAttribute(name)) return;
        let originals = originalAttributes.get(element);
        if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
        if (!originals.has(name)) originals.set(name, element.getAttribute(name));
        const original = originals.get(name), translated = dictionary[normalize(original)];
        if (!english) { if (element.getAttribute(name) !== original) element.setAttribute(name, original); }
        else if (translated && element.getAttribute(name) !== translated) element.setAttribute(name, translated);
      });
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) if (!node.parentElement?.closest('script,style,noscript')) writeText(node);
    };
    const paintLanguage = () => {
      document.documentElement.lang = english ? 'en' : 'es';
      document.body.classList.toggle('site-language-en', english);
      scanElement(document.documentElement);
      languageButton.textContent = english ? 'Español' : 'English';
      languageButton.setAttribute('aria-label', english ? 'Switch site language to Spanish' : 'Cambiar idioma del sitio a inglés');
      languageButton.setAttribute('aria-pressed', String(english));
    };
    languageButton.addEventListener('click', () => {
      english = !english;
      try { localStorage.setItem('otra-forma-de-mirar-language', english ? 'en' : 'es'); } catch (_) {}
      paintLanguage();
    });
    // The renderer updates story text, quizzes and other content after user actions.
    const languageObserver = new MutationObserver(records => {
      if (!english) return;
      records.forEach(record => {
        if (record.type === 'characterData') writeText(record.target);
        record.addedNodes?.forEach(node => { if (node.nodeType === 1) scanElement(node); else if (node.nodeType === 3) writeText(node); });
      });
    });
    languageObserver.observe(document.body, { subtree: true, childList: true, characterData: true });
    try { english = localStorage.getItem('otra-forma-de-mirar-language') === 'en'; } catch (_) { english = false; }
    paintLanguage();
  }

  // Request audible autoplay; if blocked, retry only after the visitor interacts.
  const homeVideo = document.querySelector('.home-video-frame video');
  if (homeVideo) {
    homeVideo.muted = false; homeVideo.removeAttribute('muted');
    const retryAudio = () => { homeVideo.muted = false; if (homeVideo.paused) homeVideo.play().catch(() => {}); };
    homeVideo.play().catch(() => {
      document.addEventListener('pointerdown', retryAudio, { once: true, passive: true });
      document.addEventListener('keydown', retryAudio, { once: true });
    });
  }

  // Count a section when it is actually visited directly, not only when its map card is clicked.
  const currentPage = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  if (currentPage !== 'index.html' && document.querySelector(`.route-card[data-route-id="${CSS.escape(currentPage)}"]`)) {
    const key = 'otraformamirada-visited-sections';
    try {
      const visited = JSON.parse(localStorage.getItem(key) || '[]');
      if (!visited.includes(currentPage)) localStorage.setItem(key, JSON.stringify([...visited, currentPage]));
    } catch (_) {}
  }

  // Phone/tablet motion is activated as each section enters the viewport; desktop keeps pointer interactions.
  const mobileMotion = window.matchMedia('(max-width: 760px)').matches;
  if (!reduced && mobileMotion && 'IntersectionObserver' in window) {
    const revealTargets = [...document.querySelectorAll('main > section, .expert-card, .mini-game-card, .social-card, .creator-card, .gallery-insight, .guide-card')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || window.scrollY < 2) return;
      entry.target.classList.add('mobile-reveal-in');
      if (entry.target.matches('main > section')) entry.target.classList.add('section-in-view');
      observer.unobserve(entry.target);
    }), { threshold: .06, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(target => observer.observe(target));
    window.addEventListener('scroll', () => {
      if (window.scrollY < 2) return;
      revealTargets.forEach(target => { const r=target.getBoundingClientRect(); if(r.top<innerHeight&&r.bottom>0){target.classList.add('mobile-reveal-in');if(target.matches('main > section'))target.classList.add('section-in-view');observer.unobserve(target);} });
    }, {passive:true, once:true});
  }

  // Gentle parallax follows the pointer on computers and scroll position on touch devices.
  const hero = document.querySelector('.guide-hero');
  const art = document.querySelector('.guide-hero-art');
  if (!reduced && hero && art) {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hero.addEventListener('pointermove', event => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        art.style.translate = `${(x * 14).toFixed(1)}px ${(y * 11).toFixed(1)}px`;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { art.style.translate = ''; });
    } else {
      let pending = false;
      window.addEventListener('scroll', () => {
        if (pending) return; pending = true;
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const offset = Math.max(-11, Math.min(11, (window.innerHeight * .45 - rect.top) * .022));
          art.style.translate = `0 ${offset.toFixed(1)}px`;
          pending = false;
        });
      }, { passive: true });
    }
  }

  if (reduced || document.querySelector('.ambient-particles')) return;
  const layer = document.createElement('div');
  layer.className = 'ambient-particles';
  layer.setAttribute('aria-hidden', 'true');
  let seed = 20261110;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 42; i += 1) {
    const particle = document.createElement('span');
    const star = i % 3 !== 0;
    particle.className = star ? 'particle-star' : 'particle-orb';
    if (star) particle.textContent = i % 3 === 1 ? '✦' : '✧';
    particle.style.setProperty('--x', `${(random() * 96 + 2).toFixed(1)}%`);
    particle.style.setProperty('--y', `${(random() * 96 + 2).toFixed(1)}%`);
    particle.style.setProperty('--size', star ? `${(10 + random() * 12).toFixed(1)}px` : `${(4 + random() * 5).toFixed(1)}px`);
    particle.style.setProperty('--duration', `${(9 + random() * 12).toFixed(1)}s`);
    particle.style.setProperty('--delay', `${(-random() * 16).toFixed(1)}s`);
    particle.style.setProperty('--opacity', `${(.17 + random() * .25).toFixed(2)}`);
    layer.appendChild(particle);
  }
  document.body.prepend(layer);
})();

// Ilustraciones originales completas: dos personajes diferentes flotan detrás de cada sección.
(()=>{
 const characters=['imagenes/nino.png','imagenes/harper.png','imagenes/diaactu1.png','imagenes/viejo.png','imagenes/viejo-zombie.png','imagenes/rere.png'];
 document.querySelectorAll('main > section').forEach((section,index)=>{
  if(section.querySelector(':scope > .page-character-layer'))return;
  const layer=document.createElement('div');layer.className='page-character-layer';layer.setAttribute('aria-hidden','true');
  [characters[index%characters.length],characters[(index+1)%characters.length]].forEach((src,n)=>{const image=document.createElement('img');image.src=src;image.alt='';image.loading='lazy';image.decoding='async';image.className=`page-character page-character-${n+1}`;layer.appendChild(image)});
  section.classList.add('has-page-characters');section.style.position=section.style.position||'relative';section.style.isolation=section.style.isolation||'isolate';section.prepend(layer);
 });
})();
