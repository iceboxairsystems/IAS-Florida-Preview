/* ═════════════════════════════════════════════════════════════════════
   GLACIER QR TAGS — SETTINGS (the only part you normally change)
   ═════════════════════════════════════════════════════════════════════

   Where the equipment list lives
   ------------------------------
   The unit page (unit.html) and the tag printer (tags.html) read two
   lists: UNITS (one row per piece of equipment) and VISITS (one row per
   service visit). Keep them in Google Sheets:

     1. In each Google Sheet: File → Share → Publish to web
        → choose the sheet tab → "Comma-separated values (.csv)" → Publish
     2. Paste each link between the quotes below, save, upload to GitHub.

   While the quotes are empty, the site uses units.csv and visits.csv in
   this repository (they hold one example unit, IAS-0000).

   IMPORTANT: a published sheet can be read by anyone who has its link.
   Put only equipment facts in it: never customer names, phone numbers,
   prices or access codes (only the access_hash column, never the code).
   ═════════════════════════════════════════════════════════════════════ */

window.GLACIER = {
  // Google Sheet "IAS Glacier – Units", published as CSV
  unitsCsv:  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQowiA20FzaX01oFWrB3L9xmbtwWDWNnQgkf5Sh0-tyj0YFH8ZvETNgjQzZ1agw6ausORkxZPUMnYDC/pub?output=csv',
  // Google Sheet "IAS Glacier – Visits", published as CSV
  visitsCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmPLzd8uRBpB6SLNze88k4J8LO2_pBkQLgXE7IwTj9jM7wfx0AnKlHpT5wj21eiSABzCWZ_MQn671n/pub?output=csv',

  /* The address printed inside every QR code (your final website).
     Printed tags can't be changed, so print only once iasflorida.com
     serves this site. */
  qrBase: 'https://iasflorida.com/unit.html?id=',

  /* Service requests from a tag go here as a text message. */
  textNumber: '+17868226849',
  textNumberShown: '(786) 822-6849',
  callNumber: '+17863727744',
  callNumberShown: '(786) 372-7744'
};


/* ─────────────────────────────────────────────────────────────────────
   You don't need to change anything below this line.
   ───────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var G = window.GLACIER;

  /* CSV → array of objects (handles quotes, commas and line breaks in cells) */
  G.parseCsv = function (text) {
    var rows = [], row = [], cell = '', q = false;
    text = String(text || '').replace(/^﻿/, '');
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    rows = rows.filter(function (r) { return r.some(function (v) { return String(v).trim() !== ''; }); });
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); });
    return rows.slice(1).map(function (r) {
      var o = {}; head.forEach(function (h, k) { o[h] = (r[k] == null ? '' : String(r[k])).trim(); }); return o;
    });
  };

  function get(url) {
    var sep = url.indexOf('?') === -1 ? '?' : '&';
    return fetch(url + sep + '_=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status); return r.text();
    });
  }

  /* Loads both lists. Unit IDs are compared in upper case. */
  G.load = function () {
    return Promise.all([get(G.unitsCsv || 'units.csv'), get(G.visitsCsv || 'visits.csv').catch(function () { return ''; })])
      .then(function (t) {
        var units = G.parseCsv(t[0]), visits = G.parseCsv(t[1]);
        units.forEach(function (u) { u.unit_id = (u.unit_id || '').toUpperCase(); });
        visits.forEach(function (v) { v.unit_id = (v.unit_id || '').toUpperCase(); });
        visits.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
        return { units: units, visits: visits };
      });
  };

  /* Access codes: only a fingerprint (SHA-256) of the code is stored in the
     sheet. Codes are not case-sensitive and ignore spaces and dashes. */
  G.cleanCode = function (code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); };
  G.hashCode = function (code) {
    var data = new TextEncoder().encode('IAS-Glacier|' + G.cleanCode(code));
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  };
  /* New random code: 8 characters, no look-alikes (0/O, 1/I/L) */
  G.newCode = function () {
    var abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', out = '', r = new Uint32Array(8);
    crypto.getRandomValues(r);
    for (var i = 0; i < 8; i++) out += abc[r[i] % abc.length];
    return out.slice(0, 4) + '-' + out.slice(4);
  };

  G.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
})();
