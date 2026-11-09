/* ═══════════════════════════════════════════════════════════════
   IAS FLORIDA — SCRIPT COMPARTIDO (todas las páginas)
   ───────────────────────────────────────────────────────────────
   Para Housecall Pro NO toques este archivo: usa housecall-pro.js
   ═══════════════════════════════════════════════════════════════ */

/* ───── GOOGLE ANALYTICS ─────
   ⚠️ PENDIENTE: reemplaza G-XXXXXXXXXX por tu ID real de GA4
   (analytics.google.com → Admin → Data Streams). Un solo lugar
   para todo el sitio. Mientras diga XXXX no se registra nada. */
window.GA_ID = 'G-XXXXXXXXXX';

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });
gtag('js', new Date());
function cargarAnalytics(){
  if (window.__gaCargado || !window.GA_ID || window.GA_ID.indexOf('XXXX') > -1) return;
  window.__gaCargado = true;
  const sc = document.createElement('script');
  sc.async = true;
  sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_ID;
  document.head.appendChild(sc);
  gtag('config', window.GA_ID, { anonymize_ip: true });
}

/* Almacenamiento seguro (funciona aunque localStorage esté bloqueado) */
const almacen = {
  leer(k){
    try { const v = localStorage.getItem(k); if (v !== null) return v; } catch(e){}
    const m = document.cookie.match('(^|;)\\s*' + k + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  },
  guardar(k, v){
    try { localStorage.setItem(k, v); } catch(e){}
    try { document.cookie = k + '=' + encodeURIComponent(v) + ';path=/;max-age=31536000;SameSite=Lax'; } catch(e){}
  }
};

/* ═══════════════════════════════════════════════════════════════
   IDIOMA (EN / ES)
   El inglés está escrito directamente en cada página. Aquí solo
   va el español. Textos que se repiten en todas las páginas
   (menú, pie, formularios) están abajo; los de cada página van en
   window.PAGE_ES dentro de esa página.
   ═══════════════════════════════════════════════════════════════ */
const SITE_ES = {
  'a11y.skip':'Saltar al contenido',
  'nav.services':'Servicios','nav.plans':'Planes y financiamiento','nav.about':'Nosotros',
  'nav.faq':'Preguntas','nav.contact':'Contacto','nav.call':'Línea abierta 24/7','nav.home':'Inicio',
  'btn.book':'Agendar en línea','btn.call':'Llamar al (786) 372-7744','btn.callshort':'Llamar',
  'svc.repair.t':'Reparación de AC','svc.repair.s':'Diagnóstico y reparación el mismo día',
  'svc.install.t':'Instalación nueva','svc.install.s':'Reemplazos e instalaciones, bien dimensionados',
  'svc.maint.t':'Mantenimiento','svc.maint.s':'Afinaciones dos veces al año',
  'svc.emerg.t':'Servicio de emergencia','svc.emerg.s':'Despacho diario hasta las 10 PM',
  'crumb.home':'Inicio','crumb.services':'Servicios',
  'footer.blurb':'Contratista de aire acondicionado con licencia que atiende Miami-Dade y Broward con HVAC residencial y comercial y despacho de emergencias todos los días hasta las 10 PM.',
  'footer.services':'Servicios','footer.company':'Empresa','footer.contact':'Contacto','footer.hours':'Oficina: lun–vie, 8 AM–5 PM',
  'footer.area':'Todo Miami-Dade y Broward',
  'footer.parent':'Una compañía de Icebox Air Systems',
  'footer.privacy':'Política de privacidad','footer.terms':'Términos del servicio','footer.cancel':'Cancelar membresía','footer.autopay':'Pago automático',
  'cta.title':'¿Sudando?<br><span class="italic">Arreglemos eso.</span>',
  'cta.p':'Agenda en línea o llama a nuestra línea de despacho. Servicio el mismo día en todo Miami-Dade y Broward.',
  'cookie.body':'<b>Usamos cookies.</b> Un poco de almacenamiento para recordar tu idioma y analítica opcional para ver qué páginas ayudan. Nunca vendemos tus datos. <a href="privacy.html">Política de privacidad</a>',
  'cookie.accept':'Aceptar todo','cookie.decline':'Solo lo esencial',
  'modal.title':'Gracias por confiar en IAS Florida',
  'modal.p':'Recibimos tu solicitud. Un despachador te llamará en breve; en horario laboral, normalmente en menos de 15 minutos.',
  'modal.btn':'Perfecto, gracias','modal.tel':'¿Es urgente? Llama al <a href="tel:+17863727744">(786) 372-7744</a>. Despachamos emergencias todos los días hasta las 10 PM.',
  /* Formularios */
  'f.badge':'Gratis al contratarnos',
  'f.name':'Nombre','f.phone':'Teléfono','f.email':'Correo','f.zip':'Código postal','f.opt':'(opcional)',
  'f.urgency':'¿Para cuándo?','f.urg.now':'Emergencia (ahora)','f.urg.today':'Hoy','f.urg.week':'Esta semana','f.urg.plan':'Solo estoy planeando',
  'f.service':'¿Qué necesitas?','f.svc.pick':'Elige un servicio…','f.svc.repair':'Reparación de AC','f.svc.install':'Instalación nueva',
  'f.svc.maint':'Mantenimiento','f.svc.comm':'Comercial','f.svc.emerg':'Emergencia, necesito a alguien ya','f.svc.other':'Otro / no estoy seguro',
  'f.notes':'Describe el problema','f.notes.ph':'El equipo está echando aire caliente desde esta mañana…',
  'f.meta':'Seguro. Sin spam. Nunca vendemos tus datos.',
  'f.ok.title':'Solicitud recibida','f.ok.p':'Un despachador te contactará en breve. Ten el teléfono cerca.',
  'f.plans':'Planes solicitados',
  'mb.call':'Llamar','mb.book':'Agendar',
  'hcp.cal.alt':'¿No carga? Abre la agenda en otra pestaña.',
  'top.1':'Emergencias todos los días hasta las 10 PM','top.2':'Cotización gratis al contratarnos','top.3':'Técnicos licenciados',
  'nav.calllabel':'Línea abierta 24/7','more':'Ver detalles',
  'seg.res':'Residencial','seg.com':'Comercial',
  'cta.eyebrow':'¿Listo?'
};

let currentLang = almacen.leer('ias_lang') || 'en';
const textoOriginal = new Map();

function diccionarioES(){ return Object.assign({}, SITE_ES, window.PAGE_ES || {}); }

function applyLanguage(lang){
  currentLang = lang === 'es' ? 'es' : 'en';
  almacen.guardar('ias_lang', currentLang);
  document.documentElement.lang = currentLang;
  const es = diccionarioES();
  const tipos = [['data-i18n','text'],['data-i18n-html','html'],['data-i18n-ph','placeholder'],['data-i18n-aria','aria-label']];
  tipos.forEach(([attr, modo]) => {
    document.querySelectorAll('[' + attr + ']').forEach(el => {
      const key = el.getAttribute(attr);
      const id = attr + '|' + key;
      if (!textoOriginal.has(el)) textoOriginal.set(el, {});
      const orig = textoOriginal.get(el);
      const leer = () => modo === 'text' ? el.textContent : modo === 'html' ? el.innerHTML : el.getAttribute(modo);
      const poner = v => { if (modo === 'text') el.textContent = v; else if (modo === 'html') el.innerHTML = v; else el.setAttribute(modo, v); };
      if (!(id in orig)) orig[id] = leer();
      if (currentLang === 'es' && es[key] != null) poner(es[key]);
      else poner(orig[id]);
    });
  });
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === currentLang)));
  document.querySelectorAll('.faq-item.open .faq-a').forEach(p => { p.style.maxHeight = p.scrollHeight + 'px'; });
  document.dispatchEvent(new CustomEvent('ias:lang', { detail: currentLang }));
}
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => applyLanguage(b.dataset.lang)));
applyLanguage(currentLang);

/* ═══════════════ MENÚ ═══════════════ */
(function(){
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const abierto = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(abierto));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }
  // Menú desplegable de Servicios (clic y teclado; hover en escritorio)
  document.querySelectorAll('.nav-drop').forEach(drop => {
    const btn = drop.querySelector('button');
    const set = v => { drop.classList.toggle('open', v); btn.setAttribute('aria-expanded', String(v)); };
    btn.addEventListener('click', () => set(!drop.classList.contains('open')));
    if (window.matchMedia('(hover:hover)').matches) {
      drop.addEventListener('mouseenter', () => set(true));
      drop.addEventListener('mouseleave', () => set(false));
    }
    document.addEventListener('click', e => { if (!drop.contains(e.target)) set(false); });
    drop.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); btn.focus(); } });
    drop.addEventListener('focusout', e => { if (!drop.contains(e.relatedTarget)) set(false); });
  });
})();

/* ═══════════════ VIDA: NIEVE Y APARICIÓN AL HACER SCROLL ═══════════════ */
(function(){
  const quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Nieve decorativa (se apaga sola si el visitante pidió menos movimiento)
  const nieve = document.querySelector('.snow');
  if (nieve && !quieto) {
    const simbolos = ['❄','❅','❆'];
    const cuantos = window.innerWidth < 700 ? 8 : 14;
    for (let i = 0; i < cuantos; i++) {
      const f = document.createElement('div');
      f.className = 'snowflake';
      f.textContent = simbolos[i % 3];
      f.style.left = Math.random() * 100 + '%';
      f.style.fontSize = (10 + Math.random() * 18) + 'px';
      f.style.animationDuration = (12 + Math.random() * 14) + 's';
      f.style.animationDelay = -Math.random() * 20 + 's';
      f.style.opacity = 0.3 + Math.random() * 0.4;
      nieve.appendChild(f);
    }
  }
  // Aparición escalonada
  const items = [...document.querySelectorAll('.reveal')];
  items.forEach(el => {
    if (el.style.transitionDelay) return;
    const hermanos = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const i = hermanos.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i, 4) * 0.09 + 's';
  });
  if (quieto || !('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => obs.observe(el));
})();

/* ═══════════════ PREGUNTAS FRECUENTES ═══════════════ */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const panel = item.querySelector('.faq-a');
    const abierto = item.classList.contains('open');
    item.classList.toggle('open', !abierto);
    q.setAttribute('aria-expanded', String(!abierto));
    panel.style.maxHeight = abierto ? null : panel.scrollHeight + 'px';
  });
});
window.addEventListener('resize', () => {
  document.querySelectorAll('.faq-item.open .faq-a').forEach(p => { p.style.maxHeight = p.scrollHeight + 'px'; });
});

/* ═══════════════ CHIPS DE SERVICIO ═══════════════ */
document.querySelectorAll('.chip input').forEach(input => {
  const chip = input.closest('.chip');
  const sync = () => chip.classList.toggle('selected', input.checked);
  input.addEventListener('change', sync); sync();
});

/* ═══════════════════════════════════════════════════════════════
   FORMULARIOS (Formspree)
   La dirección de envío está en action="" de cada <form>.
     Inicio (cotización rápida, respaldo) →  xvkpgbey  "Website – Home quote (backup)"
     Contacto (respaldo)                  →  xbggnjkz  "Website – Contact (backup)"
     Planes                               →  xrpzbanw  "Website – Plans request"
     Pago automático (autopay)            →  mgaagezo  "Website – Autopay sign-up"
     Cancelación de membresía             →  mvkkeoqr  "Website – Membership cancellation"
   Todos envían a jobs@iasflorida.com (cuenta Formspree, plan gratis:
   50 envíos al mes, el archivo guarda 30 días; el correo es el registro).
   Los de "respaldo" solo se usan si se vacía leadForm en housecall-pro.js.
   ═══════════════════════════════════════════════════════════════ */
const MSG = {
  es: { requerido:'Este campo es obligatorio.', nombre:'Escribe tu nombre completo.', telefono:'Escribe un teléfono válido de 10 dígitos.',
        email:'Revisa el correo; parece que falta algo.', zip:'El código postal debe tener 5 dígitos.', servicio:'Elige el servicio que necesitas.',
        enviando:'Enviando…', revisa:'Revisa los campos marcados.', consent:'Marca la casilla de autorización para continuar.',
        red:'No se pudo enviar. Revisa tu conexión e inténtalo otra vez, o llámanos al <a href="tel:+17863727744">(786) 372-7744</a>.',
        servidor:'Algo falló de nuestro lado. Llámanos al <a href="tel:+17863727744">(786) 372-7744</a> y te atendemos enseguida.' },
  en: { requerido:'This field is required.', nombre:'Please enter your full name.', telefono:'Please enter a valid 10-digit phone number.',
        email:'That email looks incomplete.', zip:'ZIP code should be 5 digits.', servicio:'Please choose the service you need.',
        enviando:'Sending…', revisa:'Please check the highlighted fields.', consent:'Please check the authorization box to continue.',
        red:'Could not send. Check your connection and try again, or call us at <a href="tel:+17863727744">(786) 372-7744</a>.',
        servidor:'Something failed on our end. Call us at <a href="tel:+17863727744">(786) 372-7744</a> and we will take care of it.' }
};
const m = k => (MSG[currentLang] || MSG.en)[k];

function mostrarError(campo, texto){
  campo.classList.add('invalid');
  campo.setAttribute('aria-invalid', 'true');
  let e = campo.parentElement.querySelector('.field-error');
  if (!e) {
    e = document.createElement('div');
    e.className = 'field-error';
    e.id = (campo.id || campo.name) + '-err';
    e.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg><span></span>';
    campo.parentElement.appendChild(e);
    campo.setAttribute('aria-describedby', e.id);
  }
  e.querySelector('span').textContent = texto;
  e.classList.add('show');
}
function limpiarError(campo){
  campo.classList.remove('invalid');
  campo.removeAttribute('aria-invalid');
  const e = campo.parentElement.querySelector('.field-error');
  if (e) e.classList.remove('show');
}
function validarCampo(campo){
  const v = (campo.value || '').trim();
  const n = campo.name;
  if (campo.hasAttribute('required') && !v) { mostrarError(campo, n === 'service' ? m('servicio') : m('requerido')); return false; }
  if (!v) { limpiarError(campo); return true; }
  if (n === 'name'  && v.length < 2)                            { mostrarError(campo, m('nombre'));   return false; }
  if (n === 'phone' && v.replace(/\D/g, '').length < 10)        { mostrarError(campo, m('telefono')); return false; }
  if (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { mostrarError(campo, m('email'));    return false; }
  if (n === 'zip'   && !/^\d{5}$/.test(v.replace(/\D/g, '')))   { mostrarError(campo, m('zip'));      return false; }
  limpiarError(campo); return true;
}

document.querySelectorAll('form[data-formspree]').forEach(form => {
  const btn = form.querySelector('button[type=submit]');
  const btnHTML = btn ? btn.innerHTML : '';
  const alerta = form.querySelector('.form-alert');
  const exito = form.parentElement.querySelector('.form-success');
  const campos = [...form.querySelectorAll('.input, .select, .textarea')];
  const casillas = [...form.querySelectorAll('input[type=checkbox][required]')];   // p. ej. la autorización de pago automático
  casillas.forEach(c => c.addEventListener('change', () => { if (c.checked) c.closest('label').classList.remove('invalid'); }));

  campos.forEach(c => {
    c.addEventListener('blur', () => validarCampo(c));
    c.addEventListener('input', () => { if (c.classList.contains('invalid')) validarCampo(c); });
    c.addEventListener('change', () => { if (c.classList.contains('invalid')) validarCampo(c); });
  });
  function avisar(html){
    if (!alerta) return;
    alerta.querySelector('p').innerHTML = html;
    alerta.classList.add('show');
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (alerta) alerta.classList.remove('show');
    const malos = campos.filter(c => !validarCampo(c));
    const sinMarcar = casillas.filter(c => !c.checked);
    sinMarcar.forEach(c => c.closest('label').classList.add('invalid'));
    if (malos.length) { avisar(m('revisa')); malos[0].focus(); return; }
    if (sinMarcar.length) { avisar(m('consent')); sinMarcar[0].focus(); return; }
    if (btn) { btn.disabled = true; btn.textContent = m('enviando'); }
    try {
      const res = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{ 'Accept':'application/json' } });
      if (!res.ok) throw new Error('http ' + res.status);
      form.reset();
      form.querySelectorAll('.chip input').forEach(i => i.dispatchEvent(new Event('change')));
      form.hidden = true;
      if (exito) exito.classList.add('active');
      if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; }
      if (!['cancel', 'autopay'].includes(form.dataset.kind)) {   // cancelar o activar el pago automático no es un lead ni abre el aviso de "te llamamos"
        gtag('event', 'generate_lead', { form_id: form.id });
        abrirGracias(form);
      }
    } catch (err) {
      console.error('Error al enviar:', err);
      if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; }
      avisar(navigator.onLine === false ? m('red') : m('servidor'));
    }
  });
});

/* Ventana de agradecimiento */
let graciasForm = null, graciasFoco = null;
function abrirGracias(form){
  const modal = document.getElementById('thanksModal');
  if (!modal) return;
  graciasForm = form; graciasFoco = document.activeElement;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const b = document.getElementById('thanksBtn');
  if (b) setTimeout(() => b.focus(), 50);
}
function cerrarGracias(){
  const modal = document.getElementById('thanksModal');
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (graciasForm) {           // dejar el formulario listo para otra solicitud
    graciasForm.hidden = false;
    const ex = graciasForm.parentElement.querySelector('.form-success');
    if (ex) ex.classList.remove('active');
  }
  if (graciasFoco && graciasFoco.focus) graciasFoco.focus();
}
(function(){
  const modal = document.getElementById('thanksModal');
  const b = document.getElementById('thanksBtn');
  if (b) b.addEventListener('click', cerrarGracias);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) cerrarGracias(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarGracias(); });
})();

/* ═══════════════ AVISO DE COOKIES ═══════════════ */
(function(){
  const barra = document.getElementById('cookieBar');
  if (!barra) return;
  const guardado = almacen.leer('ias_cookies');
  if (guardado === 'all') { gtag('consent', 'update', { analytics_storage:'granted' }); cargarAnalytics(); }
  if (!guardado) setTimeout(() => barra.classList.add('show'), 900);
  function decidir(valor){
    almacen.guardar('ias_cookies', valor);
    barra.classList.remove('show');
    if (valor === 'all') { gtag('consent', 'update', { analytics_storage:'granted' }); cargarAnalytics(); }
  }
  document.getElementById('cookieAccept').addEventListener('click', () => decidir('all'));
  document.getElementById('cookieDecline').addEventListener('click', () => decidir('essential'));
})();

/* ═══════════════════════════════════════════════════════════════
   CARRITO DE PLANES (solo en plans.html)
   Descuento combo: 10% sobre Cold Snap si se llevan Cold Snap y
   Deep Freeze juntos. Para cambiarlo, edita DESCUENTO.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const panel = document.getElementById('cartPanel');
  if (!panel) return;
  const DESCUENTO = { planes:['cold-snap','deep-freeze'], aplicaA:'cold-snap', porcentaje:0.10 };
  const TXT = {
    es:{ add:'Agregar a la solicitud', added:'Agregado ✓', plan:'plan', planes:'planes', cotizar:'A cotizar',
         vacio:'Todavía no has elegido ningún plan.', both:'Agregar los dos', bothAdded:'Los dos agregados ✓', view:'Ver solicitud' },
    en:{ add:'Add to request', added:'Added ✓', plan:'plan', planes:'plans', cotizar:'Custom quote',
         vacio:"You haven't picked any plans yet.", both:'Add both', bothAdded:'Both added ✓', view:'View request' }
  };
  const t = k => (TXT[currentLang] || TXT.en)[k];
  const carrito = new Map();
  const fab = document.getElementById('cartFab');
  const overlay = document.getElementById('cartOverlay');
  const abrir = () => { panel.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; document.getElementById('cartClose').focus(); };
  const cerrar = () => { panel.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('cartClose').addEventListener('click', cerrar);
  overlay.addEventListener('click', cerrar);
  fab.addEventListener('click', abrir);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrar(); });

  function agregar(id){
    const btn = document.querySelector('[data-plan="' + id + '"]');
    if (!btn) return;
    const card = btn.closest('.plan');
    const seg = card ? (card.querySelector('.seg')?.textContent.trim() || '') : '';
    const sub = card ? (card.querySelector('.plan-sub')?.textContent.trim() || '') : '';
    carrito.set(id, {
      nombre: btn.dataset.planName,
      precio: parseFloat(btn.dataset.planPrice) || 0,
      unidad: btn.dataset.planUnit,
      seg: seg,
      tagline: seg ? seg + ' · ' + sub : sub
    });
  }
  document.querySelectorAll('[data-plan]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.plan;
    carrito.has(id) ? carrito.delete(id) : agregar(id);
    pintar();
  }));
  const combo = document.getElementById('comboBtn');
  if (combo) combo.addEventListener('click', () => {
    const ambos = DESCUENTO.planes.every(id => carrito.has(id));
    DESCUENTO.planes.forEach(id => ambos ? carrito.delete(id) : (!carrito.has(id) && agregar(id)));
    pintar();
  });

  const money = v => '$' + (Math.round(v * 100) / 100).toFixed(2).replace(/\.00$/, '');
  const precioTexto = it => it.unidad === 'custom' ? t('cotizar') : it.unidad === 'month' ? '$' + it.precio + '/mo' : '$' + it.precio;

  function pintar(){
    const comboOn = DESCUENTO.planes.every(id => carrito.has(id));
    document.querySelectorAll('[data-plan]').forEach(btn => {
      const dentro = carrito.has(btn.dataset.plan);
      btn.classList.toggle('added', dentro);
      btn.textContent = dentro ? t('added') : t('add');
      btn.setAttribute('aria-pressed', String(dentro));
    });
    if (combo) { combo.classList.toggle('added', comboOn); combo.querySelector('span').textContent = comboOn ? t('bothAdded') : t('both'); }

    const n = carrito.size;
    fab.classList.toggle('visible', n > 0);
    fab.querySelector('.count').textContent = n;
    fab.querySelector('.label').textContent = t('view');

    const body = document.getElementById('cartBody');
    if (!n) { body.innerHTML = '<div class="cart-empty">' + t('vacio') + '</div>'; cerrar(); }
    else {
      body.innerHTML = [...carrito.entries()].map(([id, it]) => {
        const desc = comboOn && id === DESCUENTO.aplicaA;
        const precio = desc ? '<span class="ci-was">$' + it.precio + '</span>' + money(it.precio * (1 - DESCUENTO.porcentaje)) : precioTexto(it);
        return '<div class="cart-item"><div class="cart-item-info"><div class="ci-name">' + it.nombre + '</div><div class="ci-tag">' + it.tagline +
          '</div></div><div class="ci-price">' + precio + '</div><button type="button" class="cart-item-remove" data-quitar="' + id +
          '" aria-label="Remove ' + it.nombre + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>';
      }).join('');
      body.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () => { carrito.delete(b.dataset.quitar); pintar(); }));
    }

    // Totales: pagos únicos y mensuales por separado (sumarlos daría una cifra falsa)
    let unico = 0, mensual = 0, custom = false, ahorro = 0;
    carrito.forEach((it, id) => {
      if (it.unidad === 'month') { mensual += it.precio; return; }
      if (it.unidad === 'custom') { custom = true; return; }
      let p = it.precio;
      if (comboOn && id === DESCUENTO.aplicaA) { ahorro += p * DESCUENTO.porcentaje; p -= p * DESCUENTO.porcentaje; }
      unico += p;
    });
    const partes = [];
    if (unico) partes.push(money(unico));
    if (mensual) partes.push(money(mensual) + '/mo');
    if (custom) partes.push(t('cotizar'));
    document.getElementById('cartTotal').textContent = partes.length ? partes.join(' + ') : '—';
    const linea = document.getElementById('cartDiscount');
    linea.classList.toggle('active', ahorro > 0);
    document.getElementById('cartDiscountAmount').textContent = ahorro > 0 ? '– ' + money(ahorro) : '—';
    document.getElementById('cartSubmit').disabled = n === 0;

    // Resumen que viaja con el formulario
    const resumen = [...carrito.entries()].map(([id, it]) => {
      const tipo = it.seg ? ' [' + it.seg + ']' : '';
      if (comboOn && id === DESCUENTO.aplicaA) return it.nombre + tipo + ' (' + money(it.precio * (1 - DESCUENTO.porcentaje)) + ', 10% combo discount, was $' + it.precio + ')';
      return it.nombre + tipo + ' (' + precioTexto(it) + ')';
    }).join(', ');
    const input = document.getElementById('planesInput');
    if (input) input.value = resumen;
    const caja = document.getElementById('selectedPlans');
    if (caja) { caja.classList.toggle('active', n > 0); document.getElementById('selectedPlansList').textContent = resumen; }
  }

  document.getElementById('cartSubmit').addEventListener('click', () => {
    if (!carrito.size) return;
    cerrar();
    const destino = document.getElementById('request');
    if (destino) destino.scrollIntoView({ behavior:'smooth' });
    setTimeout(() => { const f = document.querySelector('#planForm input[name="name"]'); if (f) f.focus({ preventScroll:true }); }, 600);
  });

  // Enlaces tipo plans.html#add-deep-freeze agregan el plan al llegar
  const pre = (location.hash.match(/^#add-([\w-]+)/) || [])[1];
  if (pre) {
    agregar(pre);
    const tarjeta = document.getElementById('plan-' + pre);
    if (tarjeta) setTimeout(() => tarjeta.scrollIntoView({ block:'center' }), 60);
  }
  document.addEventListener('ias:lang', pintar);
  pintar();
})();
