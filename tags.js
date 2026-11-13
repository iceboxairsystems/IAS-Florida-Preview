/* ═══════════════════════════════════════════════════════════════
   GLACIER TAG PRINTER + ACCESS CODES (tags.html, office use only)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var G = window.GLACIER; if (!G) return;
  var esc = G.esc, units = [];
  var list = document.getElementById('tList'), sheet = document.getElementById('tSheet'), filter = document.getElementById('tFilter'), count = document.getElementById('tCount');

  function siteName(u) { return u.site || '—'; }
  function drawList() {
    var q = (filter.value || '').toLowerCase();
    var shown = units.filter(function (u) { return !q || (u.unit_id + ' ' + u.site + ' ' + u.location + ' ' + u.type).toLowerCase().indexOf(q) !== -1; });
    if (!units.length) { list.innerHTML = '<p class="t-note">No units in the equipment list yet.</p>'; return; }
    list.innerHTML = '<table><thead><tr><th scope="col"><span class="sr-only">Print</span></th><th scope="col">Unit</th><th scope="col">Site</th><th scope="col">Location</th><th scope="col">Code set</th></tr></thead><tbody>' +
      shown.map(function (u) {
        return '<tr><td><input type="checkbox" class="t-pick" id="pick-' + esc(u.unit_id) + '" value="' + esc(u.unit_id) + '" checked aria-label="Print tag for ' + esc(u.unit_id) + '"></td>' +
          '<td><label for="pick-' + esc(u.unit_id) + '"><b>' + esc(u.unit_id) + '</b></label><small>' + esc(u.type) + (u.tonnage ? ', ' + esc(u.tonnage) + ' ton' : '') + '</small></td>' +
          '<td>' + esc(siteName(u)) + '</td><td>' + esc(u.location) + '</td><td>' + (u.access_hash ? 'Yes' : '<span class="t-warn">No code</span>') + '</td></tr>';
      }).join('') + '</tbody></table>';
    list.querySelectorAll('.t-pick').forEach(function (c) { c.addEventListener('change', drawTags); });
    drawTags();
  }
  function drawTags() {
    var ids = Array.prototype.map.call(list.querySelectorAll('.t-pick:checked'), function (c) { return c.value; });
    count.textContent = ids.length + (ids.length === 1 ? ' tag' : ' tags') + ' ready to print';
    sheet.innerHTML = ids.map(function (id) {
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
  filter.addEventListener('input', drawList);
  document.getElementById('tAll').addEventListener('click', function () { list.querySelectorAll('.t-pick').forEach(function (c) { c.checked = true; }); drawTags(); });
  document.getElementById('tNone').addEventListener('click', function () { list.querySelectorAll('.t-pick').forEach(function (c) { c.checked = false; }); drawTags(); });
  document.getElementById('tBase').textContent = G.qrBase + 'IAS-0142';

  G.load().then(function (d) { units = d.units.slice().sort(function (a, b) { return a.unit_id.localeCompare(b.unit_id); }); drawList(); })
    .catch(function () { list.innerHTML = '<p class="t-warn" role="alert">Could not load the equipment list. Check the links in glacier-units.js.</p>'; });

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
