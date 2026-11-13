/* ═══════════════════════════════════════════════════════════════
   GLACIER UNIT PAGE (unit.html?id=IAS-0142)
   Anyone who scans a tag sees only the unit ID and how to reach us.
   Service history and service requests unlock with the building's
   access code. Settings live in glacier-units.js.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var G = window.GLACIER, app = document.getElementById('unitApp');
  if (!G || !app) return;
  var esc = G.esc;
  var id = (new URLSearchParams(location.search).get('id') || '').toUpperCase().trim();
  var data = null, unit = null, hasCode = false, history = [], unlocked = false, codeUsed = '', busy = false, waiting = false, setup = false;

  var TXT = {
    en: {
      loading: 'Loading unit…', unit: 'Unit', notFound: 'We could not find this unit',
      notFoundP: 'The tag may be new or the code may be damaged. Call us and read the ID printed on the tag.',
      noId: 'Scan the QR code on an IAS Florida equipment tag to open its record.',
      loadErr: 'This page could not reach our records. Check your connection and try again, or call us.',
      setup: 'Equipment records are being set up. Please call us for service.', checking: 'Checking…',
      maintained: 'This unit is maintained by IAS Florida under a Glacier commercial plan.',
      staffT: 'Building staff', staffP: 'Enter your site access code to see this unit\'s service history or request service. Your property manager has the code.',
      codeL: 'Site access code', unlock: 'Unlock', wrong: 'That code doesn\'t match this unit. Check it with your property manager.',
      wait: 'Too many tries. This unit is locked for 10 minutes.', noCode: 'This unit doesn\'t have an access code yet. Call us to request service.',
      safety: 'Smell gas, see smoke or fire? Leave the area and call 911.', questions: 'Questions about this unit:',
      make: 'Make / model', serial: 'Serial', tons: 'Size', refr: 'Refrigerant', loc: 'Location', serves: 'Serves', installed: 'Installed', filters: 'Filters', site: 'Site',
      ton: 'ton', last: 'Last service', next: 'Next quarterly visit', none: 'No visits recorded yet.', history: 'Service history',
      reqT: 'Request service for this unit', urg: 'How urgent is it?',
      u1: 'Routine', u1s: 'Next available visit', u2: 'Not cooling', u2s: 'Today if possible', u3: 'Emergency', u3s: 'Water leaking, smoke smell, or a critical area without cooling',
      name: 'Your name', nameErr: 'Please enter your name.', role: 'Your role (optional)', details: 'What is happening? (optional)',
      prepare: 'Prepare request', emNote: 'Emergency requests from a tag are confirmed by phone with your building\'s authorized contact before a technician is sent. After-hours rates apply.',
      ready: 'Your request is ready. Send it as a text:', sendText: 'Open text message', copy: 'Copy message', copied: 'Copied', copyFail: 'Select the message and copy it.',
      orCall: 'Or call', textTo: 'Text it to', lock: 'Lock this page', msgHead: 'IAS Florida service request', msgUnit: 'Unit', msgSite: 'Site', msgUrg: 'Urgency',
      msgFrom: 'From', msgCode: 'Access code', msgDet: 'Details'
    },
    es: {
      loading: 'Cargando equipo…', unit: 'Equipo', notFound: 'No encontramos este equipo',
      notFoundP: 'La etiqueta puede ser nueva o el código puede estar dañado. Llámanos y léenos el número impreso en la etiqueta.',
      noId: 'Escanea el código QR de una etiqueta de equipo de IAS Florida para abrir su ficha.',
      loadErr: 'No se pudo conectar con nuestros registros. Revisa tu conexión e inténtalo otra vez, o llámanos.',
      setup: 'Estamos preparando los registros de equipos. Llámanos para pedir servicio.', checking: 'Verificando…',
      maintained: 'IAS Florida da mantenimiento a este equipo con un plan comercial Glacier.',
      staffT: 'Personal del edificio', staffP: 'Escribe el código de acceso de tu edificio para ver el historial de servicio de este equipo o pedir servicio. Tu administrador de propiedad tiene el código.',
      codeL: 'Código de acceso del edificio', unlock: 'Desbloquear', wrong: 'Ese código no corresponde a este equipo. Verifícalo con tu administrador de propiedad.',
      wait: 'Demasiados intentos. Este equipo queda bloqueado por 10 minutos.', noCode: 'Este equipo todavía no tiene código de acceso. Llámanos para pedir servicio.',
      safety: '¿Huele a gas o ves humo o fuego? Sal del área y llama al 911.', questions: 'Preguntas sobre este equipo:',
      make: 'Marca / modelo', serial: 'Serie', tons: 'Capacidad', refr: 'Refrigerante', loc: 'Ubicación', serves: 'Da servicio a', installed: 'Instalado', filters: 'Filtros', site: 'Sitio',
      ton: 'toneladas', last: 'Último servicio', next: 'Próxima visita trimestral', none: 'Todavía no hay visitas registradas.', history: 'Historial de servicio',
      reqT: 'Pedir servicio para este equipo', urg: '¿Qué tan urgente es?',
      u1: 'Rutina', u1s: 'Próxima visita disponible', u2: 'No enfría', u2s: 'Hoy si es posible', u3: 'Emergencia', u3s: 'Fuga de agua, olor a humo o un área crítica sin aire',
      name: 'Tu nombre', nameErr: 'Escribe tu nombre.', role: 'Tu cargo (opcional)', details: '¿Qué está pasando? (opcional)',
      prepare: 'Preparar solicitud', emNote: 'Las emergencias pedidas desde una etiqueta se confirman por teléfono con el contacto autorizado del edificio antes de enviar al técnico. Aplica la tarifa fuera de horario.',
      ready: 'Tu solicitud está lista. Envíala como mensaje de texto:', sendText: 'Abrir mensaje de texto', copy: 'Copiar mensaje', copied: 'Copiado', copyFail: 'Selecciona el mensaje y cópialo.',
      orCall: 'O llama al', textTo: 'Envíalo al', lock: 'Bloquear esta página', msgHead: 'Solicitud de servicio IAS Florida', msgUnit: 'Equipo', msgSite: 'Sitio', msgUrg: 'Urgencia',
      msgFrom: 'De', msgCode: 'Código de acceso', msgDet: 'Detalles'
    }
  };
  function t(k) { var l = document.documentElement.lang === 'es' ? 'es' : 'en'; return (TXT[l][k] != null ? TXT[l][k] : TXT.en[k]); }
  function ss(get, key, val) { try { return get ? sessionStorage.getItem(key) : sessionStorage.setItem(key, val); } catch (e) { return null; } }

  function fmtDate(d) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(d || '')) return esc(d || '');
    var dt = new Date(d.slice(0, 10) + 'T12:00:00');
    return dt.toLocaleDateString(document.documentElement.lang === 'es' ? 'es-US' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function nextVisit(d) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(d || '')) return '';
    var dt = new Date(d.slice(0, 10) + 'T12:00:00'); dt.setMonth(dt.getMonth() + 3);
    return dt.toLocaleDateString(document.documentElement.lang === 'es' ? 'es-US' : 'en-US', { year: 'numeric', month: 'long' });
  }
  var phoneLine = function () {
    return '<p class="u-help">' + t('questions') + ' <a href="tel:' + G.callNumber + '">' + G.callNumberShown + '</a></p>';
  };

  function render() {
    if (!id) { app.innerHTML = '<p class="u-lede">' + t('noId') + '</p>' + phoneLine(); return; }
    if (setup) { app.innerHTML = '<div class="u-eyebrow">' + t('unit') + ' ' + esc(id) + '</div><p class="u-lede">' + t('setup') + '</p><p class="u-safety">' + t('safety') + '</p>' + phoneLine(); return; }
    if (!data) { app.innerHTML = '<p class="u-lede" role="status">' + t('loading') + '</p>'; return; }
    if (!unit) {
      app.innerHTML = '<div class="u-eyebrow">' + t('unit') + ' ' + esc(id) + '</div><h2 class="u-title">' + t('notFound') + '</h2><p class="u-lede">' + t('notFoundP') + '</p>' + phoneLine();
      return;
    }
    var head = '<div class="u-eyebrow">' + t('unit') + ' ' + esc(unit.unit_id) + '</div>' +
      '<h2 class="u-title">' + esc(unit.type || '') + (unit.tonnage ? ', ' + esc(unit.tonnage) + ' ' + t('ton') : '') + '</h2>' +
      '<p class="u-lede">' + t('maintained') + '</p>';
    if (!unlocked) { app.innerHTML = head + lockedView(); bindLock(); return; }
    app.innerHTML = head + unlockedView(); bindUnlocked();
  }

  function lockedView() {
    if (!hasCode) return '<div class="u-card"><p>' + t('noCode') + '</p></div><p class="u-safety">' + t('safety') + '</p>' + phoneLine();
    return '<form class="u-card u-lock" id="uLock" novalidate>' +
      '<h3>' + t('staffT') + '</h3><p>' + t('staffP') + '</p>' +
      '<div class="u-row"><div class="field"><label for="uCode">' + t('codeL') + '</label>' +
      '<input class="input" id="uCode" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text" aria-describedby="uLockMsg"' + '></div>' +
      '<button class="btn btn-primary" type="submit">' + t('unlock') + '</button></div>' +
      '<p class="u-err" id="uLockMsg" role="alert">' + (waiting ? t('wait') : '') + '</p>' +
      '</form><p class="u-safety">' + t('safety') + '</p>' + phoneLine();
  }

  function bindLock() {
    var f = document.getElementById('uLock'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var input = document.getElementById('uCode'), msg = document.getElementById('uLockMsg'), btn = f.querySelector('button[type=submit]');
      var code = G.cleanCode(input.value);
      if (!code) { input.setAttribute('aria-invalid', 'true'); msg.textContent = t('wrong'); input.focus(); return; }
      busy = true; btn.disabled = true; btn.textContent = t('checking');
      tryUnlock(code).then(function (ok) {
        busy = false;
        if (ok) { var t1 = document.getElementById('uTop'); if (t1) t1.focus(); return; }
        var i2 = document.getElementById('uCode'), m2 = document.getElementById('uLockMsg');
        if (i2) { i2.setAttribute('aria-invalid', 'true'); i2.select(); }
        if (m2) m2.textContent = waiting ? t('wait') : t('wrong');
      }).catch(function () {
        busy = false; btn.disabled = false; btn.textContent = t('unlock'); msg.textContent = t('loadErr');
      });
    });
  }

  /* The code is checked by the secure lookup (Google Apps Script), never here. */
  function tryUnlock(code) {
    return G.unlock(id, code).then(function (res) {
      if (res && res.ok && !res.locked) {
        unlocked = true; codeUsed = code; unit = res.unit; history = res.visits || []; waiting = false;
        ss(false, 'glacier_code_' + id, code);
        render(); return true;
      }
      waiting = !!(res && res.error === 'too_many');
      if (res && res.error === 'no_code') hasCode = false;
      render(); return false;
    });
  }

  function fact(k, v) { return v ? '<div><dt>' + t(k) + '</dt><dd>' + esc(v) + '</dd></div>' : ''; }

  function unlockedView() {
    var last = history[0];
    var facts = '<dl class="u-facts">' +
      fact('site', unit.site) + fact('make', [unit.make, unit.model].filter(Boolean).join(' ')) + fact('serial', unit.serial) +
      fact('refr', unit.refrigerant) + fact('loc', unit.location) + fact('serves', unit.serves) + fact('installed', unit.install_year) +
      fact('filters', unit.filter_size ? unit.filter_size + (unit.filter_qty ? ' (' + unit.filter_qty + ')' : '') : '') + '</dl>';
    var status = last ? '<p class="u-status"><b>' + t('last') + ':</b> ' + fmtDate(last.date) + ' · <b>' + t('next') + ':</b> ' + nextVisit(last.date) + '</p>' : '<p class="u-status">' + t('none') + '</p>';
    var hist = history.length ? '<h3 class="u-h3">' + t('history') + '</h3><ul class="u-hist">' + history.slice(0, 12).map(function (v) {
      return '<li><time datetime="' + esc(v.date) + '">' + fmtDate(v.date) + '</time><span>' + esc(v.work) + (v.parts ? '<small>' + esc(v.parts) + '</small>' : '') + '</span></li>';
    }).join('') + '</ul>' : '';
    var form = '<form class="u-card" id="uReq" novalidate><h3>' + t('reqT') + '</h3>' +
      '<fieldset class="u-urg"><legend>' + t('urg') + '</legend>' +
      ['1', '2', '3'].map(function (n) {
        return '<label class="u-opt' + (n === '3' ? ' u-em' : '') + '"><input type="radio" name="urg" value="' + n + '"' + (n === '1' ? ' checked' : '') + '><span><b>' + t('u' + n) + '</b><small>' + t('u' + n + 's') + '</small></span></label>';
      }).join('') + '</fieldset>' +
      '<p class="u-emnote" id="uEmNote" hidden>' + t('emNote') + '</p>' +
      '<div class="u-row2"><div class="field"><label for="uName">' + t('name') + '</label><input class="input" id="uName" autocomplete="name" required aria-describedby="uNameErr"><p class="u-err" id="uNameErr" role="alert"></p></div>' +
      '<div class="field"><label for="uRole">' + t('role') + '</label><input class="input" id="uRole" autocomplete="organization-title"></div></div>' +
      '<div class="field"><label for="uDet">' + t('details') + '</label><textarea class="textarea" id="uDet" rows="3"></textarea></div>' +
      '<button class="btn btn-primary" type="submit">' + t('prepare') + '</button>' +
      '<div id="uOut" class="u-out" tabindex="-1" hidden></div></form>';
    return '<div id="uTop" tabindex="-1">' + status + facts + '</div>' + hist + form +
      '<p class="u-safety">' + t('safety') + '</p>' + phoneLine() +
      '<button class="u-lockbtn" type="button" id="uRelock">' + t('lock') + '</button>';
  }

  function bindUnlocked() {
    var f = document.getElementById('uReq');
    var note = document.getElementById('uEmNote');
    f.querySelectorAll('input[name=urg]').forEach(function (r) { r.addEventListener('change', function () { note.hidden = f.urg.value !== '3'; }); });
    document.getElementById('uRelock').addEventListener('click', function () {
      try { Object.keys(sessionStorage).forEach(function (k) { if (k.indexOf('glacier_code_') === 0) sessionStorage.removeItem(k); }); } catch (e) {}
      unlocked = false; codeUsed = ''; render(); var c = document.getElementById('uCode'); if (c) c.focus();
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('uName'), err = document.getElementById('uNameErr');
      if (!name.value.trim()) { name.setAttribute('aria-invalid', 'true'); err.textContent = t('nameErr'); name.focus(); return; }
      name.removeAttribute('aria-invalid'); err.textContent = '';
      var urg = t('u' + f.urg.value), role = document.getElementById('uRole').value.trim(), det = document.getElementById('uDet').value.trim();
      var lines = [t('msgHead'), t('msgUnit') + ': ' + unit.unit_id + (unit.location ? ' (' + unit.location + ')' : ''),
        unit.site ? t('msgSite') + ': ' + unit.site : '', t('msgUrg') + ': ' + urg.toUpperCase(),
        t('msgFrom') + ': ' + name.value.trim() + (role ? ', ' + role : ''), t('msgCode') + ': ' + codeUsed,
        det ? t('msgDet') + ': ' + det : ''].filter(Boolean);
      var msg = lines.join('\n');
      var out = document.getElementById('uOut');
      out.innerHTML = '<p><b>' + t('ready') + '</b></p>' +
        '<label class="sr-only" for="uMsg">' + t('msgHead') + '</label><textarea class="textarea" id="uMsg" rows="7" readonly>' + esc(msg) + '</textarea>' +
        '<div class="u-actions"><a class="btn btn-primary" href="sms:' + G.textNumber + '?&body=' + encodeURIComponent(msg) + '">' + t('sendText') + '</a>' +
        '<button class="btn btn-ghost" type="button" id="uCopy">' + t('copy') + '</button></div>' +
        '<p class="u-help">' + t('textTo') + ' <b>' + G.textNumberShown + '</b> · ' + t('orCall') + ' <a href="tel:' + G.callNumber + '">' + G.callNumberShown + '</a></p>' +
        '<p class="u-status-live" role="status" id="uCopyMsg"></p>';
      out.hidden = false; out.focus();
      document.getElementById('uCopy').addEventListener('click', function () {
        var ta = document.getElementById('uMsg'), m = document.getElementById('uCopyMsg');
        (navigator.clipboard ? navigator.clipboard.writeText(msg) : Promise.reject()).then(function () { m.textContent = t('copied'); })
          .catch(function () { ta.focus(); ta.select(); m.textContent = t('copyFail'); });
      });
    });
  }

  render();
  document.addEventListener('ias:lang', function () { if (!document.getElementById('uOut') || document.getElementById('uOut').hidden) render(); });
  if (!id) return;
  G.lookup(id).then(function (res) {
    data = true;
    if (res && res.ok) { unit = res.unit; hasCode = !!res.hasCode; } else unit = null;
    var saved = ss(true, 'glacier_code_' + id);
    render();
    if (unit && hasCode && saved) return tryUnlock(saved);
  }).catch(function (err) {
    if (err && err.message === 'not_configured') { setup = true; render(); return; }
    app.innerHTML = '<div class="u-eyebrow">' + t('unit') + ' ' + esc(id) + '</div><p class="u-lede" role="alert">' + t('loadErr') + '</p>' + phoneLine();
  });
})();
