// docs/assets/js/form-sheets.js
// Compact 'Page feedback' ---> Google Sheets via Cloudflare Worker

(function () {
  function wireCompactForm() {
    const FORM = document.getElementById('gs-form');
    if (!FORM) return; // only on pages with per-page|compact form

    // demo/disabled gate
    const WRAP = document.getElementById('sheets');
    const DISABLED = FORM.dataset.disabled === 'true' || (WRAP && WRAP.classList.contains('is-demo'));
    if (DISABLED) {
      const pageField = FORM.querySelector('#gs-page');
      if (pageField) pageField.value = location.href;
      FORM.querySelectorAll('input, textarea, select, button').forEach(el => {
        if (el.type !== 'hidden') el.disabled = true;
      });
      const btn = FORM.querySelector("button[type='submit']");
      if (btn) btn.textContent = 'Feedback disabled on this page';
      FORM.addEventListener('submit', ev => ev.preventDefault());
      return;
    }

    const ENDPOINT = 'https://coe-feedback-worker.robjharrison.workers.dev/sheets';

    // Prefer ?page=… then fallback to current URL
    const params  = new URLSearchParams(location.search);
    const pageUrl = params.get('page') ? decodeURIComponent(params.get('page')) : location.href;
    const pageField = FORM.querySelector('#gs-page');
    if (pageField) pageField.value = pageUrl;

    const btn = FORM.querySelector("button[type='submit']");
    const ok  = FORM.querySelector('#gs-ok');
    const err = FORM.querySelector('#gs-err');
    const val = sel => (FORM.querySelector(sel)?.value || '').trim();

    let submitting = false;

    FORM.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (submitting) return;

      if (FORM.checkValidity && !FORM.checkValidity()) {
        FORM.reportValidity();
        return;
      }
      if (!FORM.checkValidity && !val('#gs-summary')) {
        if (err) err.hidden = false;
        return;
      }

      submitting = true;
      if (ok)  ok.hidden  = true;
      if (err) err.hidden = true;

      const payload = {
        tab:     'Feedback',
        page:    pageUrl,
        summary: val('#gs-summary'),
        details: val('#gs-details'),
        role:    val('#mf-role'),
        org:     val('#mf-org'),
        email:   val('#mf-email'),
        nature:  FORM.querySelector('#mf-nature')?.value || '',
        hp_field: val('#hp_field')
      };

      if (btn) {
        btn.disabled = true;
        btn.classList.add('is-loading');
        btn.dataset.orig = btn.textContent;
        btn.textContent = 'Sending…';
      }
      FORM.classList.add('is-submitting');

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'cors'
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.warn('Compact feedback non-OK:', res.status, res.statusText, text);
          if (err) err.hidden = false;
        } else {
          if (ok) ok.hidden = false;
          FORM.reset();
          FORM.querySelector('#gs-summary')?.focus();
          setTimeout(() => { if (ok) ok.hidden = true; }, 2500);
        }
      } catch (e) {
        console.warn('Compact feedback request failed:', e);
        if (err) err.hidden = false;
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('is-loading');
          if (btn.dataset.orig) btn.textContent = btn.dataset.orig;
        }
        FORM.classList.remove('is-submitting');
        submitting = false;
      }
    });

    // smoke log
    // console.debug('[compact] wired');
  }

  // MkDocs Material SPA support
  if (window.document$ && typeof document$.subscribe === 'function') {
    document$.subscribe(wireCompactForm);   // run on each page change
  } else {
    document.addEventListener('DOMContentLoaded', wireCompactForm); // hard load
  }
})();
