/* ═════════════════════════════════════════════════════════════════════
   GLACIER QR TAGS — SETTINGS
   ═════════════════════════════════════════════════════════════════════

   How unit records stay private
   -----------------------------
   The Glacier equipment sheets are PRIVATE Google Sheets (never "Publish
   to web"). A Google Apps Script in IAS Florida's Google account is the
   only thing this website can ask. Anyone who scans a tag gets only the
   unit's ID, type and size. The script checks the building's access code
   on Google's side and only then returns that one unit's details and
   visit history. Nothing private is stored in this website's code.

   apiUrl = the Apps Script "Web app" URL (ends in /exec).
   While it is empty, unit pages say the records are being set up.
   ═════════════════════════════════════════════════════════════════════ */

window.GLACIER = {
  apiUrl: '',

  /* The address printed inside every QR code (the final website).
     Print tags only once iasflorida.com serves this site. */
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

  function ask(opts) {
    if (!G.apiUrl) return Promise.reject(new Error('not_configured'));
    return fetch(opts.url, opts.init).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status); return r.json();
    });
  }
  /* What anyone may know: does this unit exist, and what is it? */
  G.lookup = function (id) {
    return ask({ url: G.apiUrl + '?id=' + encodeURIComponent(id), init: { method: 'GET', cache: 'no-store' } });
  };
  /* The access code goes in the request body, never in the address. */
  G.unlock = function (id, code) {
    return ask({ url: G.apiUrl, init: { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ id: id, code: code }) } });
  };

  /* Access codes: the sheet keeps only a fingerprint (SHA-256) of each code.
     Codes ignore case, spaces and dashes. */
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
