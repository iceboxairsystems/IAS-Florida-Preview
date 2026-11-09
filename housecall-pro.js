/* ═════════════════════════════════════════════════════════════════════
   HOUSECALL PRO — THE ONLY FILE YOU NEED TO EDIT TO TURN IT ON
   (Housecall Pro — el único archivo que hay que editar para activarlo)
   ═════════════════════════════════════════════════════════════════════

   Every "Book online" button on every page of this site runs through
   this file. While the two boxes below are empty, those buttons open the
   Calendly scheduler on book.html, same as before.

   STEP 1 — Copy the code from your Housecall Pro account
     • Online booking:  Marketing → Online Booking → copy the code for
                        your website (or copy your booking link)
     • Lead form:       Settings → Leads → "Share lead form" → Copy code

   STEP 2 — Paste it below, between the two backticks  `  `
     Paste it exactly as Housecall Pro gives it to you: the <script ...>
     line, a <button ...> line, an embed block, or just a link. Don't
     change anything in it. This file works out which kind it is and
     wires it up on every page automatically.

   STEP 3 — Save, then upload this one file to GitHub. Done.
     To check it: open your site with  ?hcp-check  at the end of the
     address (e.g. iasflorida.com/?hcp-check) and a small box will
     tell you what it found.

   To go back to Calendly, empty the backticks again.
   ═════════════════════════════════════════════════════════════════════ */

window.IAS_HCP = {

  /* 1) ONLINE BOOKING — code or link from Housecall Pro.
        Makes every "Book online" button open Housecall Pro booking,
        and shows it on the Book page (book.html). */
  booking: `

  `,

  /* 2) LEAD FORM — optional. Replaces the estimate request forms on the
        home page and the Contact page with your Housecall Pro lead form,
        so those requests land in Housecall Pro instead of email. */
  leadForm: `

  `,

  /* 3) WEBSITE CHAT — optional. Paste Housecall Pro's website chat bubble
        code. Then turn on CSR AI Chat (Team → AI Team → CSR AI) so the AI
        answers website chats too. The bubble shows on every page. */
  chat: `

  `,

  /* Used only while box 1 is empty. */
  fallbackCalendly: 'https://calendly.com/jobs-iasflorida/30min?hide_gdpr_banner=1&background_color=0a1929&text_color=ffffff&primary_color=fb923c'
};


/* ─────────────────────────────────────────────────────────────────────
   You don't need to change anything below this line.
   ───────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var cfg = window.IAS_HCP || {};
  var cargados = {};

  function esES() { return document.documentElement.lang === 'es'; }

  /* Figure out what was pasted: scripts, visible HTML, and/or a link. */
  function leer(codigo) {
    var r = { scripts: [], html: '', link: '', vacio: true, tieneEmbed: false };
    codigo = (codigo || '').trim();
    if (!codigo) return r;
    r.vacio = false;
    if (codigo.indexOf('<') === -1) {                      // just a link
      var m = codigo.match(/https?:\/\/[^\s"'<>]+/);
      if (m) r.link = m[0];
      return r;
    }
    var tpl = document.createElement('template');
    tpl.innerHTML = codigo;
    Array.prototype.forEach.call(tpl.content.querySelectorAll('script'), function (s) {
      r.scripts.push(s); s.parentNode.removeChild(s);
    });
    r.html = tpl.innerHTML.trim();
    r.tieneEmbed = !!tpl.content.querySelector('iframe, div, form, section');
    var a = tpl.content.querySelector('a[href^="http"]');
    if (a && !r.tieneEmbed && !r.scripts.length) r.link = a.getAttribute('href');
    return r;
  }

  /* Re-create a pasted <script> so the browser actually runs it. */
  function correrScript(viejo, dentroDe) {
    var src = viejo.getAttribute('src');
    if (src && cargados[src]) return;
    if (src) cargados[src] = true;
    var s = document.createElement('script');
    Array.prototype.forEach.call(viejo.attributes, function (a) { s.setAttribute(a.name, a.value); });
    if (!src) s.text = viejo.textContent;
    (dentroDe || document.body).appendChild(s);
  }

  /* Put pasted code into a spot on the page (HTML first, then scripts). */
  function insertar(info, destino) {
    destino.innerHTML = info.html;
    info.scripts.forEach(function (s) { correrScript(s, destino); });
  }

  var booking = leer(cfg.booking);
  var lead = leer(cfg.leadForm);
  var chat = leer(cfg.chat);

  /* ── Website chat bubble: load it once on every page ── */
  if (!chat.vacio) {
    if (chat.html) {
      var cajaChat = document.createElement('div');
      cajaChat.className = 'hcp-chat';
      cajaChat.innerHTML = chat.html;
      document.body.appendChild(cajaChat);
    }
    chat.scripts.forEach(function (s) { correrScript(s); });
    document.documentElement.classList.add('hcp-chat-on');
  }

  /* ── Lead form: swap it into the estimate-form spots ── */
  if (!lead.vacio) {
    document.querySelectorAll('[data-hcp-lead-slot]').forEach(function (slot) {
      var destino = slot.querySelector('[data-hcp-lead-target]') || slot;
      if (lead.link && !lead.html) {
        destino.innerHTML = '<div class="book-ready"><h2>' + (esES() ? 'Pide tu cotización' : 'Request an estimate') +
          '</h2><a class="btn btn-primary" target="_blank" rel="noopener" href="' + lead.link + '">' +
          (esES() ? 'Abrir el formulario' : 'Open the request form') + '</a></div>';
      } else {
        insertar(lead, destino);
      }
      slot.classList.add('hcp-on');
    });
  }

  /* ── Booking: load Housecall Pro's script on every page ── */
  var slotReserva = document.querySelector('[data-hcp-booking-slot]');
  if (!booking.vacio) {
    if (slotReserva && booking.tieneEmbed) {
      insertar(booking, slotReserva);                       // embedded widget on book.html
    } else {
      booking.scripts.forEach(function (s) { correrScript(s); });
      if (slotReserva) mostrarBotonReserva(slotReserva);
    }
  } else if (slotReserva) {
    mostrarCalendly(slotReserva);                            // fallback until HCP is pasted
  }

  function mostrarBotonReserva(slot) {
    slot.innerHTML =
      '<div class="book-ready">' +
        '<h2 data-i18n="hcp.ready.t">Book your visit online</h2>' +
        '<p data-i18n="hcp.ready.p">Choose your service and a time that works. You\'ll get a confirmation right away.</p>' +
        '<a class="btn btn-primary" href="book.html" data-book><span data-i18n="hcp.ready.b">Open online booking</span></a>' +
      '</div>';
    window.PAGE_ES = Object.assign(window.PAGE_ES || {}, {
      'hcp.ready.t': 'Agenda tu visita en línea',
      'hcp.ready.p': 'Elige tu servicio y un horario que te funcione. Recibirás la confirmación enseguida.',
      'hcp.ready.b': 'Abrir la agenda en línea'
    });
    if (typeof applyLanguage === 'function') applyLanguage(document.documentElement.lang);
  }

  function mostrarCalendly(slot) {
    if (!cfg.fallbackCalendly) return;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    slot.innerHTML = '<div class="calendly-inline-widget" data-url="' + cfg.fallbackCalendly + '"></div>' +
      '<p class="form-meta" style="padding:0 16px 16px"><a class="text-link" target="_blank" rel="noopener" href="' + cfg.fallbackCalendly +
      '" data-i18n="hcp.cal.alt">Not loading? Open the scheduler in a new tab.</a></p>';
    if (typeof applyLanguage === 'function') applyLanguage(document.documentElement.lang);
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
  }

  /* ── Every [data-book] button/link on the site comes here ── */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-book]') : null;
    if (!el) return;
    var via = '';
    if (window.HCPWidget && typeof window.HCPWidget.openModal === 'function') {
      e.preventDefault(); window.HCPWidget.openModal(); via = 'housecall_pro_modal';
    } else if (booking.link) {
      e.preventDefault(); window.open(booking.link, '_blank', 'noopener'); via = 'housecall_pro_link';
    } else if (slotReserva) {
      e.preventDefault(); slotReserva.scrollIntoView({ behavior: 'smooth', block: 'start' }); via = 'book_page';
    } else {
      via = 'book_page';                                     // normal link to book.html
    }
    if (typeof gtag === 'function') gtag('event', 'book_click', { method: via });
  });

  /* ── ?hcp-check : shows what this file found ── */
  if (/[?&]hcp-check/.test(location.search)) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        var modal = !!(window.HCPWidget && window.HCPWidget.openModal);
        var lines = [
          '<b>Housecall Pro check</b>',
          'Booking box: ' + (booking.vacio ? 'empty → using Calendly' :
            (booking.link ? 'link found ✓' : booking.scripts.length + ' script(s), ' + (booking.tieneEmbed ? 'embed ✓' : 'no embed'))),
          'Booking pop-up (HCPWidget): ' + (modal ? 'ready ✓' : (booking.vacio ? '—' : 'not loaded yet')),
          'Lead form box: ' + (lead.vacio ? 'empty → using the site\'s own forms' : 'pasted ✓'),
          'Lead form spots on this page: ' + document.querySelectorAll('[data-hcp-lead-slot]').length,
          'Chat box: ' + (chat.vacio ? 'empty' : (chat.scripts.length ? chat.scripts.length + ' script(s) ✓' : 'pasted, but no script found'))
        ];
        var box = document.createElement('div');
        box.setAttribute('role', 'status');
        box.style.cssText = 'position:fixed;left:16px;top:88px;z-index:9999;background:#fff;color:#0b1b2c;border:2px solid #0a6a9e;border-radius:10px;padding:14px 16px;font:14px/1.6 system-ui,sans-serif;max-width:340px;box-shadow:0 10px 30px rgba(0,0,0,.3)';
        box.innerHTML = lines.join('<br>');
        document.body.appendChild(box);
      }, 1500);
    });
  }
})();
