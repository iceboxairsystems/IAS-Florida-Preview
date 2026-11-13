/* ═══════════════════════════════════════════════════════════════
   GLACIER TAG PRINTER + ACCESS CODES (tags.html, office use only)
   Works from unit IDs you paste in, so it never needs to read the
   private equipment sheets.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var G = window.GLACIER; if (!G) return;
  var esc = G.esc;
  var ids = document.getElementById('tIds'), sheet = document.getElementById('tSheet'), count = document.getElementById('tCount');

  /* "IAS-0001 to IAS-0040", "IAS-0007, IAS-0009" or one per line */
  function parseIds(text) {
    var out = [], seen = {};
    String(text || '').toUpperCase().split(/[\n,;]+/).forEach(function (part) {
      part = part.trim(); if (!part) return;
      var m = part.match(/^([A-Z]+-?)(\d+)\s*(?:TO|-|–|THROUGH)\s*\1?(\d+)$/);
      if (m) {
        var a = parseInt(m[2], 10), b = parseInt(m[3], 10), w = m[2].length;
        if (b < a) { var t = a; a = b; b = t; }
        for (var n = a; n <= b && out.length < 500; n++) add(m[1] + String(n).padStart(w, '0'));
      } else if (/^[A-Z0-9-]{3,20}$/.test(part)) add(part);
    });
    function add(id) { if (!seen[id]) { seen[id] = 1; out.push(id); } }
    return out;
  }

  function drawTags() {
    var list = parseIds(ids.value);
    count.textContent = list.length ? list.length + (list.length === 1 ? ' tag' : ' tags') + ' ready to print' : '';
    sheet.innerHTML = list.map(function (id) {
      return '<figure class="tg"><div class="tg-brand"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/><line x1="5" y1="19" x2="19" y2="5"/></svg><span><b>IAS</b> FLORIDA</span></div>' +
        '<div class="tg-qr" data-id="' + esc(id) + '" role="img" aria-label="QR code for unit ' + esc(id) + '"></div>' +
        '<div class="tg-id">' + esc(id) + '</div><div class="tg-cta">Scan for service · ' + esc(G.callNumberShown) + '</div></figure>';
    }).join('');
    sheet.querySelectorAll('.tg-qr').forEach(function (box) {
      try {
        new QRCode(box, { text: G.qrBase + encodeURIComponent(box.dataset.id), width: 240, height: 240, colorDark: '#050b14', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
        var img = box.querySelector('img'); if (img) img.alt = '';
      } catch (e) { box.textContent = 'QR library did not load'; }
    });
  }
  var timer; ids.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(drawTags, 250); });
  document.getElementById('tBase').textContent = G.qrBase + 'IAS-0142';
  drawTags();

  /* ── Access codes ── */
  var codeIn = document.getElementById('cCode'), hashOut = document.getElementById('cHash'), msg = document.getElementById('cMsg');
  function showHash() {
    var c = G.cleanCode(codeIn.value);
    if (c.length < 6) { hashOut.value = ''; msg.textContent = c ? 'Use at least 6 letters or numbers.' : ''; return; }
    G.hashCode(c).then(function (h) { hashOut.value = h; msg.textContent = ''; });
  }
  codeIn.addEventListener('input', showHash);
  document.getElementById('cNew').addEventListener('click', function () { codeIn.value = G.newCode(); showHash(); codeIn.focus(); });
  document.getElementById('cCopy').addEventListener('click', function () {
    if (!hashOut.value) { msg.textContent = 'Make or type a code first.'; return; }
    (navigator.clipboard ? navigator.clipboard.writeText(hashOut.value) : Promise.reject()).then(function () { msg.textContent = 'Fingerprint copied. Paste it in the access_hash column.'; })
      .catch(function () { hashOut.focus(); hashOut.select(); msg.textContent = 'Press Ctrl+C or Cmd+C to copy.'; });
  });
})();
